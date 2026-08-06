import React, { useState, useEffect } from 'react';
import { Clock, PlayCircle, StopCircle, Zap, CheckCircle2 } from 'lucide-react';
import api from '../api';
import Swal from 'sweetalert2';

const AttendanceWidget = () => {
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveHours, setLiveHours] = useState('0.0');

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  useEffect(() => {
    let timer;
    if (todayRecord && todayRecord.status === 'punched-in') {
      timer = setInterval(() => {
        const start = new Date(todayRecord.punchIn);
        const now = new Date();
        const diffMs = now - start;
        const hrs = (diffMs / (1000 * 60 * 60)).toFixed(1);
        setLiveHours(hrs);
      }, 10000);
    }
    return () => clearInterval(timer);
  }, [todayRecord]);

  const fetchTodayAttendance = async () => {
    try {
      const res = await api.get('/attendance/today');
      setTodayRecord(res.data.data);
      if (res.data.data && res.data.data.status === 'punched-in') {
        const start = new Date(res.data.data.punchIn);
        const now = new Date();
        const diffMs = now - start;
        setLiveHours((diffMs / (1000 * 60 * 60)).toFixed(1));
      }
    } catch (err) {
      console.error('Failed to fetch today attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePunchIn = async () => {
    try {
      const res = await api.post('/attendance/punch-in');
      setTodayRecord(res.data.data);
      Swal.fire('Punched In!', `Punch in recorded at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`, 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.error || 'Failed to Punch In', 'error');
    }
  };

  const handlePunchOut = async () => {
    const result = await Swal.fire({
      title: 'Confirm Punch Out?',
      text: 'Do you want to end your shift and calculate work/overtime hours for today?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ec4899',
      cancelButtonColor: '#6366f1',
      confirmButtonText: 'Yes, Punch Out'
    });

    if (result.isConfirmed) {
      try {
        const res = await api.post('/attendance/punch-out');
        setTodayRecord(res.data.data);
        Swal.fire(
          'Shift Completed!',
          `Total Hours: ${res.data.data.workHours} hrs | Extra/Overtime: ${res.data.data.overtimeHours} hrs`,
          'success'
        );
      } catch (err) {
        console.error(err);
        Swal.fire('Error', err.response?.data?.error || 'Failed to Punch Out', 'error');
      }
    }
  };

  if (loading) return null;

  const isPunchedIn = todayRecord && todayRecord.status === 'punched-in';
  const isCompleted = todayRecord && todayRecord.status === 'completed';

  return (
    <div style={{
      background: 'rgba(15, 20, 45, 0.85)',
      border: '1px solid var(--border-light)',
      borderRadius: '16px',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1.5rem',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: isPunchedIn ? 'rgba(16, 185, 129, 0.15)' : (isCompleted ? 'rgba(168, 85, 247, 0.15)' : 'rgba(99, 102, 241, 0.15)'),
          color: isPunchedIn ? 'var(--emerald)' : (isCompleted ? 'var(--violet)' : 'var(--primary)'),
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Clock size={22} />
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Daily Shift & Attendance</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isPunchedIn && (
              <>
                <span className="status-dot pulse" style={{ background: 'var(--emerald)' }}></span>
                <span style={{ color: 'var(--emerald)' }}>Punched In</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>({liveHours} hrs elapsed)</span>
              </>
            )}

            {isCompleted && (
              <>
                <CheckCircle2 size={18} color="var(--violet)" />
                <span style={{ color: 'var(--violet)' }}>Shift Completed</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>({todayRecord.workHours} hrs logged)</span>
              </>
            )}

            {!todayRecord && (
              <span style={{ color: 'var(--text-muted)' }}>Not Punched In Today</span>
            )}
          </div>
        </div>
      </div>

      {/* Extra / Overtime Badge */}
      {todayRecord && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.35rem 0.75rem', borderRadius: '10px', color: 'var(--amber)', fontSize: '0.8rem', fontWeight: 700 }}>
          <Zap size={14} /> Overtime: {todayRecord.overtimeHours || 0} hrs
        </div>
      )}

      {/* Action Punch Buttons */}
      <div>
        {!isPunchedIn && !isCompleted && (
          <button onClick={handlePunchIn} className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', borderRadius: '10px' }}>
            <PlayCircle size={18} /> Punch In
          </button>
        )}

        {isPunchedIn && (
          <button onClick={handlePunchOut} className="btn btn-danger" style={{ padding: '0.65rem 1.25rem', borderRadius: '10px' }}>
            <StopCircle size={18} /> Punch Out
          </button>
        )}

        {isCompleted && (
          <button onClick={handlePunchIn} className="btn btn-outline" style={{ padding: '0.65rem 1.25rem', borderRadius: '10px' }}>
            <PlayCircle size={18} /> Start Extra Shift
          </button>
        )}
      </div>
    </div>
  );
};

export default AttendanceWidget;
