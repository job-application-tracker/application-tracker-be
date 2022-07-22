const pool = require('../utils/pool');

module.exports = class User {
  id;
  email;
  #passwordHash;
  appGoal;
  networkGoal;
  meetupGoal;
  linkedinGoal;
  codeGoal;
  constructor({
    id,
    email,
    password_hash,
    app_goal,
    network_goal,
    meetup_goal,
    linkedin_goal,
    code_goal,
  }) {
    this.id = id;
    this.email = email;
    this.#passwordHash = password_hash;
    this.appGoal = app_goal;
    this.networkGoal = network_goal;
    this.meetupGoal = meetup_goal;
    this.linkedinGoal = linkedin_goal;
    this.codeGoal = code_goal;
  }

  static async insert({ email, passwordHash }) {
    const { rows } = await pool.query(
      `
      INSERT INTO users (email, password_hash) 
      VALUES ($1, $2) 
      RETURNING *
      `,
      [email, passwordHash]
    );

    return new User(rows[0]);
  }

  static async getByEmail(email) {
    const { rows } = await pool.query(
      `
      SELECT * from users WHERE email=$1
      `,
      [email]
    );

    return rows[0] ? new User(rows[0]) : null;
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT * FROM users
      WHERE id=$1
      `,
      [id]
    );
    return new User(rows[0]);
  }

  static async update(id, attrs) {
    const user = await this.getById(id);
    if (!user) return null;
    const { email, appGoal, networkGoal, meetupGoal, linkedinGoal, codeGoal } =
      { ...user, ...attrs };
    const { rows } = await pool.query(
      `
      UPDATE users
      SET email=$2, app_goal=$3, network_goal=$4, meetup_goal=$5, linkedin_goal=$6, code_goal=$7
      WHERE id=$1
      RETURNING *
      `,
      [id, email, appGoal, networkGoal, meetupGoal, linkedinGoal, codeGoal]
    );
    return new User(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
