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
      `INSERT INTO users (email, password_hash) 
      VALUES ($1, $2) 
      RETURNING *`,
      [email, passwordHash]
    );

    return new User(rows[0]);
  }

  static async getByEmail(email) {
    const { rows } = await pool.query('SELECT * from users WHERE email=$1', [
      email,
    ]);

    return rows[0] ? new User(rows[0]) : null;
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
