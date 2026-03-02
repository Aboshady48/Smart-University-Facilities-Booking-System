const {pool} = require('../../config/db.js');

/**
 * 
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
    resource_id INT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,

    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,

    status VARCHAR(20) DEFAULT 'pending',  
    -- pending | approved | rejected | cancelled | completed

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (end_time > start_time)
);
 */

exports.createBooking = async (req, res) => {
    const { student_id, resource_id, start_time, end_time } = req.body;
    try {
        const newBooking = await pool.query(
            `INSERT INTO bookings (student_id, resource_id, start_time, end_time) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [student_id, resource_id, start_time, end_time]
        );
        res.status(201).json({ booking: newBooking.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getBookings = async (req, res) => {
    try {
        const bookings = await pool.query(`SELECT * FROM bookings`);
        res.status(200).json({ bookings: bookings.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getBooking = async (req, res) => {
    const { bookingId } = req.params;
    try {
        const booking = await pool.query(
            `SELECT * FROM bookings WHERE id = $1`,
            [bookingId]
        );
        if (booking.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ booking: booking.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updateBooking = async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body; // Only allow status update for simplicity
    try {
        const updatedBooking = await pool.query(
            `UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2 RETURNING *`,
            [status, bookingId]
        );
        if (updatedBooking.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ booking: updatedBooking.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.deleteBooking = async (req, res) => {
    const { bookingId } = req.params;
    try {
        const deletedBooking = await pool.query(
            `DELETE FROM bookings WHERE id = $1 RETURNING *`,
            [bookingId]
        );
        if (deletedBooking.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}



exports.approveBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const result = await pool.query(
            `UPDATE bookings
             SET status = 'approved', updated_at = CURRENT_TIMESTAMP
             WHERE id = $1 AND status = 'pending'
             RETURNING *`,
            [bookingId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Booking not found or already processed'
            });
        }

        res.status(200).json({
            message: 'Booking approved successfully',
            booking: result.rows[0]
        });

    } catch (err) {
        // Conflict due to overlapping approved booking
        if (err.code === '23P01') {
            return res.status(409).json({
                message: 'Time slot already booked for this resource'
            });
        }

        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
