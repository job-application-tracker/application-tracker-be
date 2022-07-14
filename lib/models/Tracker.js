const pool = require('../utils/pool');

module.exports = class Tracker {
  id;
  userId;
  position;
  company;
  description;
  status;
  notes;
  createdAt;
  appliedAt;
  interviewedAt;
  closedAt;
  constructor({
    id,
    user_id,
    position,
    company,
    description,
    status,
    notes,
    created_at,
    applied_at,
    interviewed_at,
    closed_at,
  }) {
    this.id = id;
    this.userId = user_id;
    this.position = position;
    this.company = company;
    this.description = description;
    this.status = status;
    this.notes = notes;
    this.createdAt = created_at;
    this.appliedAt = applied_at;
    this.interviewedAt = interviewed_at;
    this.closedAt = closed_at;
  }

  static async insert({
    userId,
    position,
    company,
    description,
    status,
    notes,
    appliedAt,
    interviewedAt,
    closedAt,
  }) {
    const { rows } = await pool.query(
      `
    INSERT INTO trackers 
    (
    user_id,
    position,
    company,
    description,
    status,
    notes,
    applied_at,
    interviewed_at,
    closed_at
    )
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
      [
        userId,
        position,
        company,
        description,
        status,
        notes,
        appliedAt,
        interviewedAt,
        closedAt,
      ]
    );
    return new Tracker(rows[0]);
  }

  static async getAll(userId) {
    const { rows } = await pool.query(
      'SELECT id, user_id, position, company, status, created_at from trackers WHERE user_id=$1',
      [userId]
    );
    return rows.map((row) => new Tracker(row));
  }
};
