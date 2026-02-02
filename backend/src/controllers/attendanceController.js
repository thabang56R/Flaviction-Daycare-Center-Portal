exports.markAttendance = async (req, res) => {
  const { childId, date, status, notes } = req.body;

  try {
    const child = await Child.findById(childId);
    if (!child) return res.status(404).json({ msg: 'Child not found' });

    const existing = child.attendance.find(a => a.date.toDateString() === new Date(date).toDateString());
    if (existing) {
      existing.status = status;
      existing.notes = notes;
    } else {
      child.attendance.push({ date: date || new Date(), status, notes });
    }

    await child.save();
    res.json({ msg: 'Attendance updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};