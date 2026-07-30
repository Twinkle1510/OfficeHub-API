import React from 'react';
import { Trash2, CheckCircle, Clock, Circle, FileText } from 'lucide-react';

const SkillCard = ({ skill, onUpdate, onDelete, onOpenDetails }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={14} />;
      case 'in-progress': return <Clock size={14} />;
      default: return <Circle size={14} />;
    }
  };

  const cycleStatus = () => {
    if (skill.subTasks?.length > 0) return; // Disable manual cycle ONLY if subtasks exist

    let nextStatus = 'pending';
    if (skill.status === 'pending') nextStatus = 'in-progress';
    else if (skill.status === 'in-progress') nextStatus = 'completed';
    else if (skill.status === 'completed') nextStatus = 'pending';
    
    onUpdate(skill._id, { status: nextStatus });
  };

  const toggleSubTask = (e, index) => {
    e.stopPropagation(); // Prevent card clicks if any
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

  return (
    <div className={`glass-panel skill-card ${skill.status}`}>
      <div className="skill-category" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{skill.category}</span>
        {totalSubTasks > 0 && (
          <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>
            {completedSubTasks}/{totalSubTasks}
          </span>
        )}
      </div>
      <div className="skill-task">{skill.task}</div>
      
      {/* Sub-tasks Display on Card */}
      {totalSubTasks > 0 && (
        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
          {skill.subTasks.map((st, idx) => (
            <div 
              key={idx} 
              onClick={(e) => toggleSubTask(e, idx)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}
              title="Click to toggle"
            >
              <div style={{
                width: '14px', height: '14px', borderRadius: '3px', 
                border: '1px solid var(--primary)', 
                background: st.completed ? 'var(--primary)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s'
              }}>
                {st.completed && <CheckCircle size={10} color="white" />}
              </div>
              <span style={{ textDecoration: st.completed ? 'line-through' : 'none', color: st.completed ? 'var(--text-muted)' : 'var(--text-main)', opacity: st.completed ? 0.7 : 1 }}>
                {st.title}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="skill-footer" style={{ marginTop: '1rem' }}>
        <button 
          onClick={cycleStatus} 
          className={`status-badge status-${skill.status}`}
          style={{ 
            border: 'none', 
            cursor: totalSubTasks > 0 ? 'default' : 'pointer', 
            fontFamily: 'inherit',
            opacity: skill.status === 'completed' ? 0.8 : 1
          }}
          disabled={totalSubTasks > 0}
          title={totalSubTasks > 0 ? "Status is auto-calculated based on checklist" : "Click to change status"}
        >
          {getStatusIcon(skill.status)}
          {
            skill.status === 'pending' ? 'Not Started' : 
            skill.status === 'in-progress' && totalSubTasks > 0 ? `${totalSubTasks - completedSubTasks} Pending` : 
            skill.status.charAt(0).toUpperCase() + skill.status.slice(1).replace('-', ' ')
          }
        </button>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => onOpenDetails(skill)} className="action-btn" title="Notes & Resources">
            <FileText size={18} />
          </button>
          <button onClick={() => onDelete(skill._id)} className="action-btn delete" title="Delete Task">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
