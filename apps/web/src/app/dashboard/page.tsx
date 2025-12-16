'use client';

import type { Business } from '@lib/types';
import { useMutation, useSuspenseQueries } from '@tanstack/react-query';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  BusinessForm,
  type BusinessFormData,
} from '@/components/business-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { trpc, queryClient, trpcMutationClient } from '@/utils/trpc';

export default function DashboardPage() {
  const router = useRouter();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [deletingBusinessId, setDeletingBusinessId] = useState<string | null>(
    null
  );

  const [{ data: businesses }, { data: categories }] = useSuspenseQueries({
    queries: [
      trpc.getAllBusinesses.queryOptions({ search: '', categoryId: 'All' }),
      trpc.getAllCategories.queryOptions(),
    ],
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: BusinessFormData) =>
      trpcMutationClient.createBusiness.mutate(data),
    onSuccess: (data) => {
      toast.success('Business created successfully!');
      queryClient.invalidateQueries({ queryKey: [['getAllBusinesses']] });
      setIsAddDialogOpen(false);
      router.push(`/business/${data.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create business');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (input: { id: string; data: BusinessFormData }) =>
      trpcMutationClient.updateBusiness.mutate(input),
    onSuccess: (data) => {
      toast.success('Business updated successfully!');
      queryClient.invalidateQueries({ queryKey: [['getAllBusinesses']] });
      setEditingBusiness(null);
      router.push(`/business/${data.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update business');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (input: { id: string }) =>
      trpcMutationClient.deleteBusiness.mutate(input),
    onSuccess: () => {
      toast.success('Business deleted successfully!');
      queryClient.invalidateQueries({ queryKey: [['getAllBusinesses']] });
      setDeletingBusinessId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete business');
    },
  });

  const handleCreate = (data: BusinessFormData) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: BusinessFormData) => {
    if (!editingBusiness) return;
    updateMutation.mutate({ id: editingBusiness.id, data });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  };

  const getBusinessFormData = (business: Business): BusinessFormData => ({
    name: business.name,
    description: business.description,
    address: business.address,
    phone: business.phone,
    email: business.email,
    website: business.website,
    googleMapUrl: business.googleMapUrl,
    facebookUrl: business.facebookUrl,
    instagramUrl: business.instagramUrl,
    timetable: business.timetable,
    categoryId: business.categoryId,
  });

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="border-b-2 border-primary bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="vintage-heading text-4xl text-primary mb-2">
                DASHBOARD
              </h1>
              <p className="vintage-subheading text-lg text-muted-foreground">
                Manage Your Business Listings
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="vintage-subheading">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Business
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="vintage-heading text-2xl">
                    Add New Business
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new business to the directory.
                  </DialogDescription>
                </DialogHeader>
                <BusinessForm
                  categories={categories}
                  onSubmit={handleCreate}
                  isSubmitting={createMutation.isPending}
                  submitLabel="Add Business"
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="vintage-body text-muted-foreground">
            {businesses.length} businesses in the directory
          </p>
        </div>

        <div className="grid gap-4">
          {businesses.map((business: Business) => (
            <Card key={business.id} className="border-2 border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="vintage-heading text-xl text-primary">
                    {business.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    {/* Edit Dialog */}
                    <Dialog
                      open={editingBusiness?.id === business.id}
                      onOpenChange={(open) =>
                        setEditingBusiness(open ? business : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="vintage-heading text-2xl">
                            Edit Business
                          </DialogTitle>
                          <DialogDescription>
                            Update the business details.
                          </DialogDescription>
                        </DialogHeader>
                        <BusinessForm
                          categories={categories}
                          defaultValues={getBusinessFormData(business)}
                          onSubmit={handleUpdate}
                          isSubmitting={updateMutation.isPending}
                          submitLabel="Save Changes"
                        />
                      </DialogContent>
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <Dialog
                      open={deletingBusinessId === business.id}
                      onOpenChange={(open) =>
                        setDeletingBusinessId(open ? business.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="vintage-heading text-xl">
                            Delete Business
                          </DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete &quot;
                            {business.name}&quot;? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-4 mt-4">
                          <Button
                            variant="outline"
                            onClick={() => setDeletingBusinessId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(business.id)}
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending
                              ? 'Deleting...'
                              : 'Delete'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <p className="text-muted-foreground">
                    {business.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-muted-foreground">
                    <span>{business.email}</span>
                    <span>{business.phone}</span>
                    <span className="text-secondary-foreground bg-secondary px-2 py-0.5 rounded text-xs">
                      {business.category.name}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {businesses.length === 0 && (
            <div className="text-center py-12">
              <p className="vintage-body text-muted-foreground text-lg">
                No businesses yet. Add your first one!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
