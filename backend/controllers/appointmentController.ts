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

    const { doctorId, appointmentDate, date, timeSlot, symptoms, notes, type, duration } = req.body;
    const finalDate = date || appointmentDate;
    if (!doctorId || !finalDate) {
      return res.status(400).json({ success: false, message: 'doctorId and date are required' });
    }

    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId,
      date: new Date(finalDate),
      timeSlot: timeSlot || '',
      symptoms: symptoms || '',
      notes: notes || '',
      type: type || 'online',
      duration: duration || 30,
      status: 'pending'
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