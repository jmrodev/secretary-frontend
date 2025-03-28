import Week from "../components/appointments/Week.jsx";
const Appointments = () => {
    return (
        <div>
            <h1>Appointments</h1>
            <p>Here you can manage your appointments.</p>
            <p>Click on a date to view or add appointments.</p>
            <Week />
        </div>
    );
}

export default Appointments;