import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeekAppointments, addAppointment } from '../../redux/slices/appointmentSlice.js';
import { getWeekDates, formatStructuredDate } from '../../utils/dateUtils';
import ErrorMessage from '../common/ErrorMessage';
import AppointmentForm from './AppointmentForm';
import '../../styles/components/Week.css';

const Week = () => {
  const dispatch = useDispatch();
  const { appointments = [], loading, error, selectedDate } = useSelector(state => state.appointments || {});
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Filter out weekends (Saturday and Sunday) from the weekDates
  const weekDates = getWeekDates(selectedDate || new Date()).filter(date => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Exclude Sunday (0) and Saturday (6)
  });

  useEffect(() => {
    const startDate = weekDates[0].toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const endDate = weekDates[weekDates.length - 1].toISOString().split('T')[0];
    dispatch(fetchWeekAppointments({ startDate, endDate }));
  }, [dispatch, selectedDate]);

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => {
      const appointmentDate = new Date(apt.date); // Use the "date" field from the backend response
      return (
        appointmentDate.getFullYear() === date.getFullYear() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getDate() === date.getDate()
      );
    });
  };

  const getAppointmentForSlot = (date, time) => {
    const appointmentsForDate = getAppointmentsForDate(date);
    return appointmentsForDate.find(apt => apt.time === time); // Match by "time" field
  };

  const handleTimeSlotClick = (date, time) => {
    setSelectedSlot({ date, time });
    setShowForm(true);
  };

  const handleSaveAppointment = async (appointmentData) => {
    try {
      await dispatch(addAppointment(appointmentData));
      setShowForm(false);
      setSelectedSlot(null);
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  if (loading) {
    return <div className="loading">Cargando calendario...</div>;
  }

  return (
    <section className="section week-container">
      <h2 className="section-title">Calendario Semanal</h2>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => {
            const startDate = weekDates[0].toISOString().split('T')[0];
            const endDate = weekDates[weekDates.length - 1].toISOString().split('T')[0];
            dispatch(fetchWeekAppointments({ startDate, endDate }));
          }}
        />
      )}

      <div className="week-grid">
        {weekDates.map((date, index) => (
          <div key={index} className="card day-column">
            <div className="day-header">
              <h3 className="text-light">{formatStructuredDate(date, { weekday: 'short' })}</h3>
              <span className="text-light">{formatStructuredDate(date, { day: 'numeric', month: 'short' })}</span>
            </div>

            <div className="time-slots">
              {timeSlots.map(time => {
                const appointment = getAppointmentForSlot(date, time); // Get the appointment for this slot
                return (
                  <div
                    key={time}
                    className={`time-slot ${appointment ? 'occupied' : 'available'}`}
                    onClick={() => !appointment && handleTimeSlotClick(date, time)}
                  >
                    <span className="time">{time}</span>
                    {appointment && (
                      <div className="appointment-info">
                        <span className="patient-name">{appointment.patient}</span> {/* Use "patient" field */}
                        <span className="appointment-reason">{appointment.reason}</span> {/* Use "reason" field */}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showForm && selectedSlot && (
        <AppointmentForm
          date={selectedSlot.date}
          time={selectedSlot.time}
          onSave={handleSaveAppointment}
          onCancel={() => {
            setShowForm(false); // Close the modal
            setSelectedSlot(null); // Reset the selected slot
          }}
        />
      )}
    </section>
  );
};

export default Week;
