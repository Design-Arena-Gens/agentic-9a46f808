import asyncHandler from 'express-async-handler';
import { Prescription } from '../models/Prescription.js';
import { Appointment } from '../models/Appointment.js';
import { generatePrescriptionPdf } from '../utils/pdfGenerator.js';

export const createPrescription = asyncHandler(async (req, res) => {
  const { appointmentId, medications, notes } = req.body;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  if (!appointment.doctorId.equals(req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to issue prescription');
  }

  const prescription = await Prescription.create({
    appointmentId,
    doctorId: appointment.doctorId,
    patientId: appointment.patientId,
    medications,
    notes,
  });

  res.status(201).json({ prescription });
});

export const listPrescriptions = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === 'patient') {
    filter.patientId = req.user._id;
  }
  if (req.user.role === 'doctor') {
    filter.doctorId = req.user._id;
  }

  const prescriptions = await Prescription.find(filter)
    .sort({ issuedAt: -1 })
    .populate('patientId', 'name email')
    .populate('doctorId', 'name email specialization');

  res.json({ prescriptions });
});

export const getPrescriptionById = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate('patientId', 'name email')
    .populate('doctorId', 'name email specialization');

  if (!prescription) {
    res.status(404);
    throw new Error('Prescription not found');
  }

  if (
    req.user.role === 'patient' && !prescription.patientId._id.equals(req.user._id)
  ) {
    res.status(403);
    throw new Error('Forbidden');
  }

  if (
    req.user.role === 'doctor' && !prescription.doctorId._id.equals(req.user._id)
  ) {
    res.status(403);
    throw new Error('Forbidden');
  }

  res.json({ prescription });
});

export const downloadPrescriptionPdf = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate('patientId', 'name email')
    .populate('doctorId', 'name email specialization');

  if (!prescription) {
    res.status(404);
    throw new Error('Prescription not found');
  }

  if (
    req.user.role === 'patient' && !prescription.patientId._id.equals(req.user._id)
  ) {
    res.status(403);
    throw new Error('Forbidden');
  }

  if (
    req.user.role === 'doctor' && !prescription.doctorId._id.equals(req.user._id)
  ) {
    res.status(403);
    throw new Error('Forbidden');
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=prescription-${prescription._id}.pdf`);

  generatePrescriptionPdf(prescription, res);
});
