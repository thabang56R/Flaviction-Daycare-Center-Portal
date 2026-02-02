// backend/src/controllers/reportController.js
import Child from '../models/Child.js';

export const addDailyReport = async (req, res) => {
  const { childId, date, meals, sleep, mood, activities, notes } = req.body;

  try {
    const child = await Child.findById(childId);
    if (!child) return res.status(404).json({ msg: 'Child not found' });

    child.dailyReports.push({
      date: date || new Date(),
      meals,
      sleep,
      mood,
      activities: activities || [],
      notes,
      teacher: req.user.userId,
    });

    await child.save();

    res.status(201).json(child.dailyReports[child.dailyReports.length - 1]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getDailyReports = async (req, res) => {
  const { childId } = req.params;

  try {
    const child = await Child.findById(childId).select('dailyReports');
    if (!child) return res.status(404).json({ msg: 'Child not found' });

    res.json(child.dailyReports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const markAttendance = async (req, res) => {
  const { childId, date, status, notes } = req.body;

  try {
    const child = await Child.findById(childId);
    if (!child) return res.status(404).json({ msg: 'Child not found' });

    const existing = child.attendance.find(
      (a) => a.date.toDateString() === new Date(date).toDateString()
    );

    if (existing) {
      existing.status = status;
      existing.notes = notes;
    } else {
      child.attendance.push({
        date: date || new Date(),
        status,
        notes,
      });
    }

    await child.save();

    res.json({ message: 'Attendance updated', attendance: child.attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};