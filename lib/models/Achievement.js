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
    const data = new Achievement(rows[0]);
    return new Achievement(rows[0]);
  }
};
