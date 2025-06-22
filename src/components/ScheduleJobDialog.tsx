import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataContext } from "@/context/DataContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface ScheduleJobDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleJobDialog = ({ isOpen, onClose }: ScheduleJobDialogProps) => {
  const context = useContext(DataContext);
  if (!context) throw new Error("DataContext not found");

  const { scheduleJob, customers } = context;

  const [customerName, setCustomerName] = useState("");
  const [jobType, setJobType] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSubmit = () => {
    if (!customerName || !jobType || !date) return;
    scheduleJob({
        customerName,
        jobType,
        date,
        status: 'scheduled',
    });
    onClose();
    // Reset form
    setCustomerName("");
    setJobType("");
    setDate(new Date());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule New Job</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerName" className="text-right">Customer</Label>
            <Select onValueChange={setCustomerName} value={customerName}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                    {customers.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jobType" className="text-right">Job Type</Label>
            <Input id="jobType" value={jobType} onChange={(e) => setJobType(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className="col-span-3 justify-start text-left font-normal"
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    />
                </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 