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
    this.status = status;
    this.createdAt = created_at;
    this.description = description || '';
    this.notes = notes || '';
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
      `SELECT 
      id, user_id, position, company, status, created_at, notes, description  
      from trackers 
      WHERE user_id=$1`,
      [userId]
    );
    return rows.map((row) => new Tracker(row));
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * from trackers WHERE id=$1', [
      id,
    ]);
    return rows[0] ? new Tracker(rows[0]) : null;
  }

  static async updateById(id, attrs) {
    const item = await this.getById(id);
    if (!item) throw new Error(`Could not find job with id ${id}`);
    const {
      position,
      company,
      description,
      status,
      notes,
      appliedAt,
      interviewedAt,
      closedAt,
    } = { ...item, ...attrs };
    const { rows } = await pool.query(
      `
    UPDATE trackers 
    set position=$2, company=$3, description=$4, status=$5, notes=$6, applied_at=$7, interviewed_at=$8, closed_at=$9
    WHERE id=$1
    RETURNING *`,
      [
        id,
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
  static async deleteById(id) {
    const { rows } = await pool.query(
      'DELETE from trackers WHERE id=$1 RETURNING *',
      [id]
    );
    return new Tracker(rows[0]);
  }
};
