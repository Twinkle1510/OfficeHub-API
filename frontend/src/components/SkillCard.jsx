import React from 'react';
import { Trash2, CheckCircle2, Clock, Circle, FileText, Check } from 'lucide-react';

const SkillCard = ({ skill, onUpdate, onDelete, onOpenDetails }) => {
  const cycleStatus = () => {
    if (skill.subTasks?.length > 0) return; // Disable manual cycle ONLY if subtasks exist

    let nextStatus = 'pending';
    if (skill.status === 'pending') nextStatus = 'in-progress';
    else if (skill.status === 'in-progress') nextStatus = 'completed';
    else if (skill.status === 'completed') nextStatus = 'pending';
    
    onUpdate(skill._id, { status: nextStatus });
  };

  const toggleSubTask = (e, index) => {
    e.stopPropagation();
    const updatedSubTasks = skill.subTasks.map((st, i) => 
      i === index ? { ...st, completed: !st.completed } : st
    );

    const total = updatedSubTasks.length;
    const completed = updatedSubTasks.filter(st => st.completed).length;
    
    let newStatus = 'pending';
    if (completed === 0) newStatus = 'pending';
    else if (completed === total) newStatus = 'completed';
    else newStatus = 'in-progress';

    onUpdate(skill._id, { ...skill, status: newStatus, subTasks: updatedSubTasks });
  };

  const totalSubTasks = skill.subTasks?.length || 0;
  const completedSubTasks = skill.subTasks?.filter(st => st.completed).length || 0;
  const progressPercent = totalSubTasks > 0 ? Math.round((completedSubTasks / totalSubTasks) * 100) : (skill.status === 'completed' ? 100 : (skill.status === 'in-progress' ? 50 : 0));

  return (
    <div className="skill-card">
      <div>
        <div className="skill-card-header">
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span className="skill-category-badge">{skill.category}</span>
            {skill.targetDate && skill.status !== 'completed' && new Date(skill.targetDate) < new Date() && (
              <span style={{ 
                fontSize: '0.7rem', fontWeight: 700, color: 'var(--rose)', 
                background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', 
                padding: '0.2rem 0.5rem', borderRadius: '6px' 
              }}>
                ⚠️ OVERDUE
              </span>
            )}
          </div>
          
          {/* Status Badge */}
          <button 
            onClick={cycleStatus} 
            className={`status-pill ${skill.status}`}
            style={{ 
              border: 'none', 
              cursor: totalSubTasks > 0 ? 'default' : 'pointer', 
              fontFamily: 'inherit'
            }}
            disabled={totalSubTasks > 0}
            title={totalSubTasks > 0 ? "Status is auto-calculated based on checklist" : "Click to change status"}
          >
            <span className={`status-dot ${skill.status === 'in-progress' ? 'pulse' : ''}`}></span>
            {
              skill.status === 'pending' ? 'Not Started' : 
              skill.status === 'in-progress' && totalSubTasks > 0 ? `${completedSubTasks}/${totalSubTasks} Done` : 
              skill.status.charAt(0).toUpperCase() + skill.status.slice(1).replace('-', ' ')
            }
          </button>
        </div>

        <div className="skill-task">{skill.task}</div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            <span>Progress</span>
            <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{progressPercent}%</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${progressPercent}%`, 
              height: '100%', 
              background: skill.status === 'completed' ? 'var(--emerald)' : (skill.status === 'in-progress' ? 'var(--amber)' : 'var(--border-light)'),
              transition: 'width 0.4s ease'
            }}></div>
          </div>
        </div>
        
        {/* Sub-tasks Display on Card */}
        {totalSubTasks > 0 && (
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
            {skill.subTasks.map((st, idx) => (
              <div 
                key={idx} 
                onClick={(e) => toggleSubTask(e, idx)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: idx === totalSubTasks - 1 ? 0 : '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}
                title="Click to toggle"
              >
                <div style={{
                  width: '16px', height: '16px', borderRadius: '4px', 
                  border: st.completed ? 'none' : '1px solid var(--border-highlight)', 
                  background: st.completed ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s', flexShrink: 0
                }}>
                  {st.completed && <Check size={11} color="white" strokeWidth={3} />}
                </div>
                <span style={{ textDecoration: st.completed ? 'line-through' : 'none', color: st.completed ? 'var(--text-subtle)' : 'var(--text-main)' }}>
                  {st.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
        <button 
          onClick={() => onOpenDetails(skill)} 
          className="btn btn-outline" 
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          title="Notes & Resources"
        >
          <FileText size={14} /> Notes
        </button>
        <button 
          onClick={() => onDelete(skill._id)} 
          className="btn btn-danger" 
          style={{ padding: '0.4rem 0.65rem', fontSize: '0.8rem' }}
          title="Delete Task"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default SkillCard;
