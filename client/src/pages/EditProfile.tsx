import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Camera, Save, Trash2, ArrowLeft, Upload, Loader2 } from "lucide-react";
import { uploadImage } from "@/services/uploadService";

export default function EditProfile() {
  const { user, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const profilePicRef = useRef<HTMLInputElement>(null);
  const licensePicRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const profilePic =
    user?.role === "doctor"
      ? user?.doctor?.profilePicture
      : user?.patient?.profilePicture;

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    profilePicture: profilePic || "",
    contactNumber: user?.patient?.contactNumber || "",
    age: user?.patient?.age ? String(user.patient.age) : "",
    gender: user?.patient?.gender || "",
    address: user?.patient?.address || "",
    emergencyContact: user?.patient?.emergencyContact || "",
    medicalHistory: user?.patient?.medicalHistory || "",
    specialization: user?.doctor?.specialization || "",
    qualification: user?.doctor?.qualification || "",
    experience: user?.doctor?.experience ? String(user.doctor.experience) : "",
    consultationFee: user?.doctor?.consultationFee ? String(user.doctor.consultationFee) : "",
    bio: user?.doctor?.bio || "",
    licenseNumber: user?.doctor?.licenseNumber || "",
    licensePicture: user?.doctor?.licensePicture || "",
    hospitalAffiliation: "",
  });

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProfile(true);
    try {
      const url = await uploadImage(file);
      set("profilePicture", url);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingProfile(false);
    }
  };

  const handleLicensePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLicense(true);
    try {
      const url = await uploadImage(file);
      set("licensePicture", url);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingLicense(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates: any = { fullName: form.fullName, profilePicture: form.profilePicture };

      if (user?.role === "patient") {
        updates.age = form.age ? Number(form.age) : undefined;
        updates.gender = form.gender;
        updates.contactNumber = form.contactNumber;
        updates.address = form.address;
        updates.emergencyContact = form.emergencyContact;
        updates.medicalHistory = form.medicalHistory;
      } else if (user?.role === "doctor") {
        updates.specialization = form.specialization;
        updates.qualification = form.qualification;
        updates.experience = form.experience ? Number(form.experience) : undefined;
        updates.consultationFee = form.consultationFee ? Number(form.consultationFee) : undefined;
        updates.bio = form.bio;
        updates.licenseNumber = form.licenseNumber;
        updates.licensePicture = form.licensePicture;
        updates.hospitalAffiliation = form.hospitalAffiliation;
      }

      await updateProfile(updates);
      alert("Profile updated successfully!");
      navigate(user?.role === "doctor" ? "/doctor/dashboard" : "/dashboard");
    } catch (err: any) {
      alert(`Failed to save: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) { alert("Please enter your password to confirm deletion."); return; }
    setIsDeleting(true);
    try {
      await deleteAccount(deletePassword);
    } catch (err: any) {
      alert(`Failed to delete account: ${err.message}`);
      setIsDeleting(false);
    }
  };

  const initials = user?.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
            <p className="text-sm text-muted-foreground">Update your personal information and profile picture</p>
          </div>
        </div>

        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Your photo will appear on your profile and cards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-border">
                  <AvatarImage src={form.profilePicture} alt={form.fullName} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => profilePicRef.current?.click()}
                  className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground p-1.5 shadow hover:opacity-90"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                <input
                  ref={profilePicRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => profilePicRef.current?.click()}
                  disabled={uploadingProfile}
                  className="gap-2"
                >
                  {uploadingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploadingProfile ? "Uploading..." : "Upload Photo"}
                </Button>
                <p className="text-xs text-muted-foreground">JPG, PNG or WebP, max 5MB</p>
                {form.profilePicture && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive text-xs"
                    onClick={() => set("profilePicture", "")}
                  >
                    Remove photo
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Your full name" />
            </div>

            {user?.role === "patient" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" type="number" value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="25" />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Phone Number</Label>
                  <Input id="contactNumber" value={form.contactNumber} onChange={(e) => set("contactNumber", e.target.value)} placeholder="+1 234 567 8900" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="123 Main St, City, Country" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input id="emergencyContact" value={form.emergencyContact} onChange={(e) => set("emergencyContact", e.target.value)} placeholder="Name: +1 234 567 8900" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicalHistory">Medical History / Notes</Label>
                  <Textarea id="medicalHistory" value={form.medicalHistory} onChange={(e) => set("medicalHistory", e.target.value)} placeholder="Relevant medical history, allergies, conditions..." rows={4} />
                </div>
              </>
            )}

            {user?.role === "doctor" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Specialization</Label>
                    <Select value={form.specialization} onValueChange={(v) => set("specialization", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                        <SelectItem value="Psychologist">Psychologist</SelectItem>
                        <SelectItem value="Therapist">Therapist</SelectItem>
                        <SelectItem value="Counselor">Counselor</SelectItem>
                        <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                        <SelectItem value="Clinical Psychology">Clinical Psychology</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification</Label>
                    <Input id="qualification" value={form.qualification} onChange={(e) => set("qualification", e.target.value)} placeholder="MBBS, MD, PhD..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input id="experience" type="number" value={form.experience} onChange={(e) => set("experience", e.target.value)} placeholder="5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consultationFee">Consultation Fee (Rs.)</Label>
                    <Input id="consultationFee" type="number" value={form.consultationFee} onChange={(e) => set("consultationFee", e.target.value)} placeholder="500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospitalAffiliation">Hospital / Clinic Affiliation</Label>
                  <Input id="hospitalAffiliation" value={form.hospitalAffiliation} onChange={(e) => set("hospitalAffiliation", e.target.value)} placeholder="City General Hospital" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio / About</Label>
                  <Textarea id="bio" value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Tell patients about yourself, your approach and expertise..." rows={4} />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* License (doctors only) */}
        {user?.role === "doctor" && (
          <Card>
            <CardHeader>
              <CardTitle>License Information</CardTitle>
              <CardDescription>Your professional credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input id="licenseNumber" value={form.licenseNumber} onChange={(e) => set("licenseNumber", e.target.value)} placeholder="PSY-12345" />
              </div>
              <div className="space-y-2">
                <Label>License Document</Label>
                <input
                  ref={licensePicRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleLicensePicUpload}
                />
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => licensePicRef.current?.click()}
                    disabled={uploadingLicense}
                    className="gap-2"
                  >
                    {uploadingLicense ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploadingLicense ? "Uploading..." : "Upload License"}
                  </Button>
                  {form.licensePicture && (
                    <a href={form.licensePicture} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      View uploaded document
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save */}
        <div className="flex justify-between items-center">
          <Button onClick={handleSave} disabled={isSaving} className="gap-2 px-8">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Separator />

        {/* Danger Zone */}
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Permanently delete your account and all associated data. This cannot be undone.</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account, appointments, messages, and all data. Enter your password to confirm.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-2">
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeletePassword("")}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || !deletePassword}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete My Account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
