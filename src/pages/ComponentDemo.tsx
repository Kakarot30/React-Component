import React, { useState } from 'react';
import { InputField } from '@/components/ui/input-field';
import { DataTable, Column } from '@/components/ui/data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Sample data for the table
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
}

const sampleUsers: User[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-01-15'
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob.smith@company.com',
    role: 'Developer',
    status: 'active',
    lastLogin: '2024-01-14'
  },
  {
    id: 3,
    name: 'Carol Davis',
    email: 'carol.davis@company.com',
    role: 'Designer',
    status: 'inactive',
    lastLogin: '2024-01-10'
  },
  {
    id: 4,
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    role: 'Manager',
    status: 'pending',
    lastLogin: '2024-01-12'
  },
  {
    id: 5,
    name: 'Emma Brown',
    email: 'emma.brown@company.com',
    role: 'Developer',
    status: 'active',
    lastLogin: '2024-01-15'
  }
];

const ComponentDemo = () => {
  // Input field states
  const [basicInput, setBasicInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorInput, setErrorInput] = useState('invalid@');
  const [loadingInput, setLoadingInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Table states
  const [tableData, setTableData] = useState<User[]>(sampleUsers);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<User[]>([]);

  // Table columns
  const columns: Column<User>[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sortable: true,
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      sortable: true,
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
      sortable: true,
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sortable: true,
      render: (status: string) => {
        const variant = {
          active: 'default',
          inactive: 'secondary',
          pending: 'outline'
        }[status as keyof typeof variant] || 'default';
        
        return (
          <Badge variant={variant as any}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      }
    },
    {
      key: 'lastLogin',
      title: 'Last Login',
      dataIndex: 'lastLogin',
      sortable: true,
    }
  ];

  const handleLoadingDemo = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsLoading(false);
    setLoadingInput('Loading complete!');
  };

  const handleTableLoadingDemo = async () => {
    setIsTableLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsTableLoading(false);
  };

  const clearTableData = () => {
    setTableData([]);
  };

  const restoreTableData = () => {
    setTableData(sampleUsers);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            React Component Library
          </h1>
          <p className="text-xl text-muted-foreground">
            Professional InputField and DataTable components with TypeScript support
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* InputField Demo */}
          <Card>
            <CardHeader>
              <CardTitle>InputField Component</CardTitle>
              <CardDescription>
                Flexible input component with multiple variants, states, and features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Input */}
              <div>
                <h4 className="text-sm font-medium mb-3">Basic Input (Outlined)</h4>
                <InputField
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={basicInput}
                  onChange={(e) => setBasicInput(e.target.value)}
                  helperText="This is a basic outlined input field"
                  showClearButton
                />
              </div>

              {/* Filled Variant */}
              <div>
                <h4 className="text-sm font-medium mb-3">Filled Variant</h4>
                <InputField
                  variant="filled"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  helperText="Filled variant with email validation"
                  showClearButton
                />
              </div>

              {/* Password with Toggle */}
              <div>
                <h4 className="text-sm font-medium mb-3">Password Input</h4>
                <InputField
                  variant="outlined"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  helperText="Password field with visibility toggle"
                  showPasswordToggle
                />
              </div>

              {/* Error State */}
              <div>
                <h4 className="text-sm font-medium mb-3">Error State</h4>
                <InputField
                  variant="outlined"
                  label="Email with Error"
                  type="email"
                  placeholder="Enter valid email"
                  value={errorInput}
                  onChange={(e) => setErrorInput(e.target.value)}
                  invalid
                  errorMessage="Please enter a valid email address"
                />
              </div>

              {/* Loading State */}
              <div>
                <h4 className="text-sm font-medium mb-3">Loading State</h4>
                <InputField
                  variant="filled"
                  label="Loading Demo"
                  placeholder="Click button to simulate loading"
                  value={loadingInput}
                  onChange={(e) => setLoadingInput(e.target.value)}
                  loading={isLoading}
                  helperText="Demonstrates loading state with spinner"
                />
                <Button 
                  onClick={handleLoadingDemo} 
                  disabled={isLoading}
                  className="mt-2"
                  size="sm"
                >
                  {isLoading ? 'Loading...' : 'Start Loading Demo'}
                </Button>
              </div>

              {/* Size Variants */}
              <div>
                <h4 className="text-sm font-medium mb-3">Size Variants</h4>
                <div className="space-y-3">
                  <InputField
                    size="sm"
                    placeholder="Small size input"
                    variant="outlined"
                  />
                  <InputField
                    size="md"
                    placeholder="Medium size input (default)"
                    variant="outlined"
                  />
                  <InputField
                    size="lg"
                    placeholder="Large size input"
                    variant="outlined"
                  />
                </div>
              </div>

              {/* Disabled State */}
              <div>
                <h4 className="text-sm font-medium mb-3">Disabled State</h4>
                <InputField
                  variant="outlined"
                  label="Disabled Input"
                  placeholder="This input is disabled"
                  value="Cannot edit this"
                  disabled
                  helperText="This field is disabled"
                />
              </div>
            </CardContent>
          </Card>

          {/* DataTable Demo */}
          <Card>
            <CardHeader>
              <CardTitle>DataTable Component</CardTitle>
              <CardDescription>
                Feature-rich data table with sorting, selection, and loading states
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Table Controls */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={handleTableLoadingDemo}
                  disabled={isTableLoading}
                  size="sm"
                  variant="outline"
                >
                  {isTableLoading ? 'Loading...' : 'Demo Loading'}
                </Button>
                <Button
                  onClick={clearTableData}
                  size="sm"
                  variant="outline"
                >
                  Clear Data
                </Button>
                <Button
                  onClick={restoreTableData}
                  size="sm"
                  variant="outline"
                >
                  Restore Data
                </Button>
              </div>

              {/* Selection Info */}
              {selectedRows.length > 0 && (
                <div className="p-3 bg-primary-light rounded-md">
                  <p className="text-sm text-primary-foreground">
                    {selectedRows.length} row(s) selected
                  </p>
                </div>
              )}

              {/* Data Table */}
              <DataTable
                data={tableData}
                columns={columns}
                loading={isTableLoading}
                selectable
                onRowSelect={setSelectedRows}
                emptyMessage="No users found. Click 'Restore Data' to reload sample data."
              />

              {/* Table Features */}
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Click column headers to sort data</p>
                <p>• Use checkboxes to select rows</p>
                <p>• Responsive design with horizontal scroll</p>
                <p>• Loading and empty states included</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documentation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Component Features</CardTitle>
            <CardDescription>
              Overview of the implemented features and TypeScript interfaces
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-3">InputField Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Multiple variants (filled, outlined, ghost)</li>
                  <li>✓ Size options (small, medium, large)</li>
                  <li>✓ Validation states (error, invalid)</li>
                  <li>✓ Loading state with spinner</li>
                  <li>✓ Password visibility toggle</li>
                  <li>✓ Clear button functionality</li>
                  <li>✓ Disabled state</li>
                  <li>✓ ARIA accessibility labels</li>
                  <li>✓ TypeScript interface</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">DataTable Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Column sorting (ascending/descending/none)</li>
                  <li>✓ Row selection (single/multiple)</li>
                  <li>✓ Loading state with spinner</li>
                  <li>✓ Empty state with custom message</li>
                  <li>✓ Custom cell rendering</li>
                  <li>✓ Responsive design</li>
                  <li>✓ Hover effects and visual feedback</li>
                  <li>✓ ARIA accessibility</li>
                  <li>✓ Generic TypeScript support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComponentDemo;