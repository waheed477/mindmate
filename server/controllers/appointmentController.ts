import { Request, Response } from 'express';
import { Appointment } from "../models/Appointment";
import { Doctor } from "../models/Doctor";
import { Patient } from "../models/Patient";

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    if (user?.role !== 'patient') {
      return res.status(403).json({ success: false, message: 'Only patients can book appointments' });
    }

    const patient = await Patient.findOne({ userId: user.id });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    const { doctorId, appointmentDate, date, timeSlot, symptoms, notes, healthCondition, type, duration } = req.body;
    const finalDate = appointmentDate || date;
    if (!doctorId || !finalDate) {
      return res.status(400).json({ success: false, message: 'doctorId and date are required' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const appointmentDateTime = new Date(finalDate);
    const normalizedReason = typeof symptoms === 'string' ? symptoms.trim() : '';
    const normalizedTimeSlot = typeof timeSlot === 'string' ? timeSlot.trim() : '';

    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId,
      date: appointmentDateTime,
      symptoms: normalizedReason,
      healthCondition: typeof healthCondition === 'string' ? healthCondition : undefined,
      notes: normalizedTimeSlot
        ? `Preferred slot: ${normalizedTimeSlot}${notes ? '. ' + notes : ''}`
        : (notes || ''),
      type: type || 'online',
      duration: duration || 30,
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor', 'fullName specialization consultationFee verificationStatus userId')
      .populate('patient', 'fullName age gender contactNumber userId');

    res.status(201).json({
      success: true,
      message: 'Appointment request sent successfully',
      appointment: populatedAppointment,
      data: populatedAppointment,
    });
  } catch (error: any) {
    console.error('Create appointment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAppointments = async (req: Request, res: Response) => {
  try {
    let appointments;
    const user = req.user as any;

    if (user?.role === 'patient') {
      const patient = await Patient.findOne({ userId: user.id });
      appointments = patient
        ? await Appointment.find({ patientId: patient._id })
            .populate('doctor', 'fullName specialization consultationFee profilePicture')
            .sort({ date: -1 })
        : [];
    } else if (user?.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: user.id });
      appointments = doctor
        ? await Appointment.find({ doctorId: doctor._id })
            .populate('patient', 'fullName age condition contact userId')
            .sort({ date: -1 })
        : [];
    } else {
      appointments = await Appointment.find().populate('patient doctor');
    }

    res.json({ success: true, data: appointments, appointments });
  } catch (error: any) {
    console.error('Get appointments error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'fullName age condition contact')
      .populate('doctor', 'fullName specialization consultationFee profilePicture');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, data: appointment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, data: appointment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.doctorId })
      .populate('patient', 'fullName age condition');

    res.json({ success: true, data: appointments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId })
      .populate('doctor', 'fullName specialization consultationFee');

    res.json({ success: true, data: appointments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

