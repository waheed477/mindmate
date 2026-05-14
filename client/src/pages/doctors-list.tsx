import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDoctorId, useDoctorSpecializations, useDoctors } from "@/hooks/use-doctors";
import { FilterX, Loader2, Search, Star, Stethoscope } from "lucide-react";

const formatFee = (fee?: number) => {
  if (typeof fee !== "number") return "Not listed";
  return `Rs. ${fee}`;
};

const DoctorStars = ({ rating = 0 }: { rating?: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, idx) => {
      const filled = idx < Math.round(rating);
      return (
        <Star
          key={idx}
          className={`h-4 w-4 ${filled ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"}`}
        />
      );
    })}
    <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
  </div>
);

export default function DoctorsList() {
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");

  const filters = useMemo(() => {
    const parsedMinFee = minFee.trim() === "" ? undefined : Number(minFee);
    const parsedMaxFee = maxFee.trim() === "" ? undefined : Number(maxFee);
    return {
      search: search.trim() || undefined,
      specialization: specialization === "all" ? undefined : specialization,
      minFee: Number.isNaN(parsedMinFee) ? undefined : parsedMinFee,
      maxFee: Number.isNaN(parsedMaxFee) ? undefined : parsedMaxFee,
    };
  }, [maxFee, minFee, search, specialization]);

  const { data: doctors = [], isLoading, isFetching } = useDoctors(filters);
  const { data: specializations = [] } = useDoctorSpecializations();

  const clearFilters = () => {
    setSearch("");
    setSpecialization("all");
    setMinFee("");
    setMaxFee("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 space-y-8 text-center ml-[90px] mr-[90px]">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-display tracking-tight">Find Your Specialist</h1>
          <p className="text-muted-foreground">Search by doctor name, specialization, and consultation fee range.</p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or specialization" />
              </div>

              <Select value={specialization} onValueChange={setSpecialization}>
                <SelectTrigger><SelectValue placeholder="Specialization" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {specializations.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input type="number" min="0" placeholder="Min fee" value={minFee} onChange={(e) => setMinFee(e.target.value)} />
              <Input type="number" min="0" placeholder="Max fee" value={maxFee} onChange={(e) => setMaxFee(e.target.value)} />
            </div>

            <Button variant="outline" onClick={clearFilters} className="gap-2">
              <FilterX className="h-4 w-4" />
              Clear filters
            </Button>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center py-14">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : doctors.length === 0 ? (
          <Card>
            <CardContent className="py-14 text-center space-y-3">
              <Stethoscope className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="font-medium">No doctors found</p>
              <p className="text-sm text-muted-foreground">Try changing your search or filters.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{doctors.length} doctors found</p>
              {isFetching && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating results...
                </div>
              )}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => {
                const doctorId = getDoctorId(doctor);
                const initials = doctor.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "DR";

                return (
                  <Card key={doctorId ?? doctor.fullName} className="flex flex-col justify-between">
                    <CardHeader className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-14 w-14 border border-border">
                          <AvatarImage src={doctor.profilePicture} alt={doctor.fullName} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5 min-w-0">
                          <CardTitle className="text-lg leading-tight">{doctor.fullName}</CardTitle>
                          <p className="text-sm text-muted-foreground truncate">{doctor.specialization}</p>
                        </div>
                      </div>
                      <DoctorStars rating={doctor.rating ?? 0} />
                      {doctor.bio && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{doctor.bio}</p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Consultation Fee</span>
                        <span className="font-semibold">{formatFee(doctor.consultationFee)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Experience</span>
                        <span className="font-semibold">{doctor.experience ?? 0} years</span>
                      </div>
                      {doctorId ? (
                        <Button asChild className="w-full">
                          <Link to={`/doctors/${doctorId}`}>View Profile</Link>
                        </Button>
                      ) : (
                        <Button className="w-full" disabled>View Profile</Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
