"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { TableComponent } from "@/components/ui/TableComponent";
import { Spinner } from "@/components/ui/spinner";
import { getVolunteerAppsColumns } from "./VolunteerAppsColumns";
import { getAllVolunteers, deleteVolunteer, VolunteerResponse } from "@/features/public/volunteer";

export const VolunteerAppsTable = () => {
  const [volunteers, setVolunteers] = useState<VolunteerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVolunteers = async () => {
    try {
      setIsLoading(true);
      const res = await getAllVolunteers();
      if (res && res.volunteers) {
        setVolunteers(res.volunteers);
      }
    } catch (err) {
      console.error("Failed to load volunteers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const updateVolunteerAppStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      if (status === 'Rejected') {
        await deleteVolunteer(id);
        setVolunteers(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const columns = getVolunteerAppsColumns(updateVolunteerAppStatus);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Volunteer Applications</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner className="size-8 text-primary" />
          </div>
        ) : (
          <TableComponent 
            headers={columns} 
            data={volunteers} 
            emptyMessage="No volunteer applications found" 
            className="shadow-none border-0" 
          />
        )}
      </CardContent>
    </Card>
  );
};

