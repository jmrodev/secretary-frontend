import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/components/appointments/appointmentForm.css';

const AppointmentForm = ({ date, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        time: '',
        patientName: '',
        doctorName: '',
        reason: '',
        notes: '',
        status: 'scheduled'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const appointmentData = {
            appointmentDate: `${date.getFullYear()}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`, // Format as YYYY-MM-DD without timezone offset
            appointmentTime: formData.time,
            patientName: formData.patientName,
            doctorName: formData.doctorName,
            reason: formData.reason,
            notes: formData.notes,
            status: formData.status
        };
        onSave(appointmentData);
    };

    return (
        <div className="appointment-form-container">
            <form className="appointment-form" onSubmit={handleSubmit}>
                <h2>Crear Cita</h2>
                <p>Fecha: {date.toLocaleDateString()}</p>
                <div className="form-group">
                    <label htmlFor="time">Hora:</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="patientName">Nombre del Paciente:</label>
                    <input
                        type="text"
                        id="patientName"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="doctorName">Nombre del Doctor:</label>
                    <input
                        type="text"
                        id="doctorName"
                        name="doctorName"
                        value={formData.doctorName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="reason">Motivo:</label>
                    <textarea
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="notes">Notas:</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Estado:</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="scheduled">Programada</option>
                        <option value="completed">Completada</option>
                        <option value="cancelled">Cancelada</option>
                    </select>
                </div>
                <div className="form-actions">
                    <button type="submit" className="save-button">Guardar</button>
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onCancel} // Call the onCancel function passed as a prop
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

AppointmentForm.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default AppointmentForm;
