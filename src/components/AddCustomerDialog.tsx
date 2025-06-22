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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DataContext } from "@/context/DataContext";

interface AddCustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCustomerDialog = ({ isOpen, onClose }: AddCustomerDialogProps) => {
  const context = useContext(DataContext);
  if (!context) throw new Error("DataContext not found");

  const { addCustomer } = context;

  const [name, setName] = useState("");
  const [type, setType] = useState<'Residential' | 'Commercial'>('Residential');
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!name) return; // Basic validation
    addCustomer({
        name,
        type,
        email,
        phone,
        address,
        contactPerson,
        billingAddress,
        notes,
    });
    onClose();
    // Reset form
    setName("");
    setType("Residential");
    setEmail("");
    setPhone("");
    setAddress("");
    setContactPerson("");
    setBillingAddress("");
    setNotes("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Type</Label>
            <RadioGroup defaultValue="Residential" value={type} onValueChange={(value: 'Residential' | 'Commercial') => setType(value)} className="col-span-3 flex gap-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Residential" id="r1" />
                    <Label htmlFor="r1">Residential</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Commercial" id="r2" />
                    <Label htmlFor="r2">Commercial</Label>
                </div>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactPerson" className="text-right">Contact Person</Label>
            <Input id="contactPerson" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">Address</Label>
            <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="billingAddress" className="text-right">Billing Address</Label>
            <Textarea id="billingAddress" placeholder="Leave empty to use same as address" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 