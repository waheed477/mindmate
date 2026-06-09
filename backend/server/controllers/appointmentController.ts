import { Request, Response } from 'express';
import { Appointment } from '../models/Appointment.ts';
import { Doctor } from '../models/Doctor.ts';
import { Patient } from '../models/Patient.ts';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email?: string;
  };
}

export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'patient') {
      return res.status(403).json({ success: false, message: 'Only patients can book appointments' });
    }

    const patient = await Patient.findOne({ userId: req.user.id });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    const { doctorId, appointmentDate, timeSlot, symptoms } = req.body;

    const appointment = await Appointment.create({
      patientId: patient._id,
<<<<<<< HEAD
      doctorId: doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot: timeSlot,
      symptoms: symptoms || '',
      status: 'pending'
=======
      doctorId,
      date: appointmentDateTime,
      symptoms: normalizedReason,
      healthCondition: typeof healthCondition === "string" ? healthCondition : undefined,
      notes:
        typeof notes === "string" && notes.trim().length > 0
          ? `Preferred slot: ${normalizedTimeSlot}. ${notes.trim()}`
          : `Preferred slot: ${normalizedTimeSlot}`,
      type: type || "online",
      duration: duration || 30,
      activityLog: [{
        action: "Appointment requested",
        performedBy: "patient",
        details: `Request for ${normalizedDate} at ${normalizedTimeSlot} sent to Dr. ${doctor.fullName}`
      }]
    });

    // Populate doctor and patient details
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("doctor", "fullName specialization consultationFee verificationStatus userId")
      .populate("patient", "fullName age gender contactNumber userId");

    // Notify the doctor in real-time about the new booking
    try {
      const io = getIO();
      const doctorUserId = typeof doctor.userId === "object"
        ? String((doctor.userId as any)._id ?? doctor.userId)
        : String(doctor.userId ?? "");
      if (doctorUserId) {
        io.to(`user_${doctorUserId}`).emit("new_appointment", {
          type: "new_appointment",
          appointmentId: String(appointment._id),
          patientName: patient.fullName || "A patient",
          date: appointmentDateTime.toLocaleDateString("en-US", { dateStyle: "medium" }),
          message: `New appointment request from ${patient.fullName || "a patient"} on ${appointmentDateTime.toLocaleDateString("en-US", { dateStyle: "medium" })}.`,
        });
      }
    } catch (socketErr) {
      console.warn("[Socket] Failed to emit new_appointment notification:", socketErr);
    }

    res.status(201).json({
      success: true,
      message: "Appointment request sent successfully",
      appointment: populatedAppointment
>>>>>>> 2e3d8ce5b71538475f6cd78de28b09d49eb45f0a
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error: any) {
    console.error('Create appointment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    let appointments;
    
    if (req.user?.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.id });
      if (patient) {
        appointments = await Appointment.find({ patientId: patient._id })
          .populate('doctorId', 'fullName specialization consultationFee profilePicture');
      } else {
        appointments = [];
      }
    } else if (req.user?.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (doctor) {
        appointments = await Appointment.find({ doctorId: doctor._id })
          .populate('patientId', 'fullName age condition contact');
      } else {
        appointments = [];
      }
    } else {
      appointments = await Appointment.find().populate('patientId doctorId');
    }
    
    res.json({ success: true, data: appointments });
  } catch (error: any) {
    console.error('Get appointments error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAppointmentById = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'fullName age condition contact')
      .populate('doctorId', 'fullName specialization consultationFee profilePicture');
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    res.json({ success: true, data: appointment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAppointment = async (req: AuthRequest, res: Response) => {
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

export const deleteAppointment = async (req: AuthRequest, res: Response) => {
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

export const getDoctorAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.doctorId })
      .populate('patientId', 'fullName age condition');
    
    res.json({ success: true, data: appointments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId })
      .populate('doctorId', 'fullName specialization consultationFee');
    
    res.json({ success: true, data: appointments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};