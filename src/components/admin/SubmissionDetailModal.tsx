
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];

interface SubmissionDetailModalProps {
  submission: FormSubmission;
  editingNotes: string;
  editingStatus: string;
  onClose: () => void;
  onNotesChange: (notes: string) => void;
  onStatusChange: (status: string) => void;
  onSave: (updates: {
    status: string;
    admin_notes: string;
    property_type?: string;
    property_ownership?: string;
    current_heating_system?: string;
    epc_score?: string;
  }) => void;
}

export const SubmissionDetailModal = ({
  submission,
  editingNotes,
  editingStatus,
  onClose,
  onNotesChange,
  onStatusChange,
  onSave
}: SubmissionDetailModalProps) => {
  const [propertyType, setPropertyType] = useState(submission.property_type || '');
  const [propertyOwnership, setPropertyOwnership] = useState(submission.property_ownership || '');
  const [currentHeatingSystem, setCurrentHeatingSystem] = useState(submission.current_heating_system || '');
  const [epcScore, setEpcScore] = useState(submission.epc_score || '');
  const [isOpen, setIsOpen] = useState(true);

  const formatServiceType = (serviceType: string) => {
    const formatted = {
      eco4: 'ECO4',
      solar: 'Solar',
      gas_boilers: 'Gas Boilers',
      home_improvements: 'Home Improvements'
    };
    return formatted[serviceType as keyof typeof formatted] || serviceType;
  };

  const getAddressFromFormData = () => {
    if (submission.form_data && typeof submission.form_data === 'object' && 'address' in submission.form_data) {
      return submission.form_data.address as string;
    }
    return null;
  };

  const handleSave = async () => {
    console.log('💾 SubmissionDetailModal handleSave called with:', {
      status: editingStatus,
      admin_notes: editingNotes,
      property_type: propertyType,
      property_ownership: propertyOwnership,
      current_heating_system: currentHeatingSystem,
      epc_score: epcScore
    });
    
    onSave({
      status: editingStatus,
      admin_notes: editingNotes,
      property_type: propertyType,
      property_ownership: propertyOwnership,
      current_heating_system: currentHeatingSystem,
      epc_score: epcScore
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Lead Details</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3 text-lg">Contact Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Full Name</Label>
                    <p className="text-sm">{submission.name}</p>
                  </div>
                  {submission.email && (
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm">{submission.email}</p>
                    </div>
                  )}
                  {submission.phone && (
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm">{submission.phone}</p>
                    </div>
                  )}
                  {getAddressFromFormData() && (
                    <div>
                      <Label className="text-sm font-medium">Address</Label>
                      <p className="text-sm">{getAddressFromFormData()}</p>
                    </div>
                  )}
                  {submission.postcode && (
                    <div>
                      <Label className="text-sm font-medium">Post Code</Label>
                      <p className="text-sm">{submission.postcode}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-lg">Service Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Service Type</Label>
                    <p className="text-sm">{formatServiceType(submission.service_type)}</p>
                  </div>
                </div>
              </div>

              {(submission.utm_source || submission.utm_medium || submission.utm_campaign) && (
                <div>
                  <h3 className="font-medium mb-3 text-lg">Marketing Attribution</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    {submission.utm_source && (
                      <div>
                        <Label className="text-sm font-medium">Source</Label>
                        <p className="text-sm">{submission.utm_source}</p>
                      </div>
                    )}
                    {submission.utm_medium && (
                      <div>
                        <Label className="text-sm font-medium">Medium</Label>
                        <p className="text-sm">{submission.utm_medium}</p>
                      </div>
                    )}
                    {submission.utm_campaign && (
                      <div>
                        <Label className="text-sm font-medium">Campaign</Label>
                        <p className="text-sm">{submission.utm_campaign}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Manual Entry Fields */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3 text-lg">Property Details (Manual Entry)</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detached">Detached</SelectItem>
                        <SelectItem value="semi-detached">Semi-Detached</SelectItem>
                        <SelectItem value="bungalow">Bungalow</SelectItem>
                        <SelectItem value="mid-terrace">Mid-Terrace</SelectItem>
                        <SelectItem value="end-terrace">End-Terrace</SelectItem>
                        <SelectItem value="flat">Flat</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="propertyOwnership">Property Ownership</Label>
                    <Select value={propertyOwnership} onValueChange={setPropertyOwnership}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ownership type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="landlord">Landlord</SelectItem>
                        <SelectItem value="private-tenant">Private Tenant</SelectItem>
                        <SelectItem value="housing-association">Housing Association</SelectItem>
                        <SelectItem value="council">Council</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="currentHeatingSystem">Current Heating System</Label>
                    <Select value={currentHeatingSystem} onValueChange={setCurrentHeatingSystem}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select heating system" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mains-gas">Mains Gas</SelectItem>
                        <SelectItem value="oil-boiler">Oil Boiler</SelectItem>
                        <SelectItem value="lpg">LPG</SelectItem>
                        <SelectItem value="electric-boiler">Electric Boiler</SelectItem>
                        <SelectItem value="storage-heaters">Storage Heaters</SelectItem>
                        <SelectItem value="room-heaters">Room Heaters</SelectItem>
                        <SelectItem value="ashp">ASHP</SelectItem>
                        <SelectItem value="biomass">Biomass</SelectItem>
                        <SelectItem value="coal">Coal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="epcScore">EPC Score</Label>
                    <Select value={epcScore} onValueChange={setEpcScore}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select EPC rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No EPC">No EPC</SelectItem>
                        <SelectItem value="A">A (92-100)</SelectItem>
                        <SelectItem value="B">B (81-91)</SelectItem>
                        <SelectItem value="C">C (69-80)</SelectItem>
                        <SelectItem value="D">D (55-68)</SelectItem>
                        <SelectItem value="E">E (39-54)</SelectItem>
                        <SelectItem value="F">F (21-38)</SelectItem>
                        <SelectItem value="G">G (1-20)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-lg">Lead Management</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={editingStatus} onValueChange={onStatusChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="survey_booked">Survey Booked</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                        <SelectItem value="doesnt_qualify">Doesn't Qualify</SelectItem>
                        <SelectItem value="no_contact">No Contact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Admin Notes</Label>
                    <Textarea
                      value={editingNotes}
                      onChange={(e) => onNotesChange(e.target.value)}
                      placeholder="Add notes about this lead..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
