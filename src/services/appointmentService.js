import config from '../config/env.cfg';

export const getAllApointments = async () => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${config.baseUrl}/appointment?page=1&limit=10`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al obtener citas');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en getAllApointments:', error);
        throw error;
    }
};

export const getApointmentById = async (id) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${config.baseUrl}/appointment/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al obtener cita');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en getApointmentById:', error);
        throw error;
    }
};

export const createApointment = async (appointmentData) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${config.baseUrl}/appointment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                patientName: appointmentData.patientName,
                doctorName: appointmentData.doctorName,
                reason: appointmentData.reason,
                appointmentDate: appointmentData.appointmentDate,
                appointmentTime: appointmentData.appointmentTime,
                status: 'scheduled' // Default status for new appointments
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear cita');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en createApointment:', error);
        throw error;
    }
};

export const updateApointment = async (id, appointmentData) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${config.baseUrl}/appointment/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(appointmentData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar cita');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en updateApointment:', error);
        throw error;
    }
};

export const deleteApointment = async (id) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${config.baseUrl}/appointment/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al eliminar cita');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en deleteApointment:', error);
        throw error;
    }
};

export const checkAvailability = async (date, time) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${config.baseUrl}/appointment/check-availability?date=${date}&time=${time}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al verificar disponibilidad');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en checkAvailability:', error);
        throw error;
    }
};

export const getMonthlyCounts = async (year, month) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${config.baseUrl}/appointment/monthly-counts?year=${year}&month=${month}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al obtener conteo mensual');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en getMonthlyCounts:', error);
        throw error;
    }
};

export const getAppointmentsByDate = async (year, month, day) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${config.baseUrl}/appointment/by-date?year=${year}&month=${month}&day=${day}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('authToken'); // Remove invalid token
                window.location.href = '/login'; // Redirect to login page
            }
            const error = await response.json();
            throw new Error(error.message || 'Error al obtener citas por fecha');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en getAppointmentsByDate:', error);
        throw error;
    }
};
