import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/components/calendar.css';

const Calendar = ({ excludeWeekends = true }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDayClick = (day) => {
        const selectedDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        );
        setSelectedDate(selectedDate);
        console.log('Selected date:', selectedDate);
    };

    const renderDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const days = [];

        // Add empty days for alignment
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="empty-day"></div>);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday (0) or Saturday (6)
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

            if (!excludeWeekends || !isWeekend) {
                days.push(
                    <div
                        key={day}
                        className={`day ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleDayClick(day)}
                    >
                        {day}
                    </div>
                );
            }
        }

        return days;
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>&lt;</button>
                <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
                <button onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className="days-of-week">
                {daysOfWeek.map((day) => (
                    <div key={day} className="day-of-week">
                        {day}
                    </div>
                ))}
            </div>
            <div className="days">{renderDays()}</div>
            {selectedDate && (
                <div className="selected-date">
                    Fecha seleccionada: {selectedDate.toLocaleDateString()}
                </div>
            )}
        </div>
    );
};

Calendar.propTypes = {
    excludeWeekends: PropTypes.bool, // Prop to control whether weekends are excluded
};

export default Calendar;