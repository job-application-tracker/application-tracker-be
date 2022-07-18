const pool = require('../utils/pool');

module.exports = class Achievement {
  id;
  userId;
  appNum;
  networkNum;
  meetupNum;
  linkedinNum;
  codeNum;
  year;
  week;

  constructor(row) {
    this.id = row.id;
    this.userId = row.user_id;
    this.appNum = row.app_num;
    this.networkNum = row.network_num;
    this.meetupNum = row.meetup_num;
    this.linkedinNum = row.linkedin_num;
    this.codeNum = row.code_num;
    this.year = row.year;
    this.week = row.week;
  }

  static async insert({ userId, year, week }) {
    const { rows } = await pool.query(
      `
      INSERT INTO achievements (
      user_id,
      year,
      week
      ) VALUES ($1, $2, $3)
      RETURNING *`,
      [userId, year, week]
    );
    return new Achievement(rows[0]);
  }

  static async getByWeek(userId, year, week) {
    const { rows } = await pool.query(
      `
    SELECT * FROM achievements
    WHERE user_id=$1 and year=$2 and week=$3
    `,
      [userId, year, week]
    );
    if (!rows[0]) {
      await this.insert({ userId, year, week });
    } else {
      return new Achievement(rows[0]);
    }
  }

  static async updateByWeek(userId, year, week, attrs) {
    const current = await this.getByWeek(userId, year, week);
    if (!current) throw new Error('This week does not exist');
    const { appNum, networkNum, meetupNum, linkedinNum, codeNum } = {
      ...current,
      ...attrs,
    };
    const { rows } = await pool.query(
      `
    UPDATE achievements
    SET app_num=$2, network_num=$3, meetup_num=$4, linkedin_num=$5, code_num=$6
    WHERE user_id=$1 and year=$7 and week=$8
    RETURNING *
    `,
      [userId, appNum, networkNum, meetupNum, linkedinNum, codeNum, year, week]
    );
    return new Achievement(rows[0]);
  }

  static async sumAchievements(userId) {
    const { rows } = await pool.query(
      `
    SELECT 
    SUM(app_num) as app_sum,
    SUM(network_num) as network_sum,
    SUM(meetup_num) as meetup_sum,
    SUM(linkedin_num) as linkedin_sum,
    SUM(code_num) as code_sum
    FROM achievements
    WHERE user_id=$1
    `,
      [userId]
    );
    const appSum = rows[0].app_sum;
    const networkSum = rows[0].network_sum;
    const meetupSum = rows[0].meetup_sum;
    const linkedinSum = rows[0].linkedin_sum;
    const codeSum = rows[0].code_sum;
    return {
      userId,
      appSum: Number(appSum),
      networkSum: Number(networkSum),
      meetupSum: Number(meetupSum),
      linkedinSum: Number(linkedinSum),
      codeSum: Number(codeSum),
    };
  }

  static async getAllWeeks(userId) {
    const { rows } = await pool.query(
      `
    SELECT * FROM achievements
    WHERE user_id=$1
    ORDER BY year, week ASC
    `,
      [userId]
    );
    return rows.map((row) => new Achievement(row));
  }
};
