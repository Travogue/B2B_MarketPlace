import { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Button, ButtonGroup } from '@mui/material';
import { toast } from 'react-toastify';
import { companyAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const AdminSellers = () => {
  const [companies, setCompanies] = useState([]);

  const load = () => companyAPI.getAll({ all: 'true' }).then(({ data }) => setCompanies(data.data.companies || []));

  useEffect(() => { load(); }, []);

  const handleApprove = async (id, status) => {
    await companyAPI.approve(id, { status });
    toast.success(`Seller ${status}`);
    load();
  };

  return (
    <>
      <PageHeader title="Seller Approval" subtitle="Review and approve seller registrations" />
      <Paper>
        <Table>
          <TableHead><TableRow><TableCell>Company</TableCell><TableCell>Type</TableCell><TableCell>Location</TableCell><TableCell>GST</TableCell><TableCell>Status</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>
            {companies.map((c) => (
              <TableRow key={c._id}>
                <TableCell>{c.companyName}</TableCell>
                <TableCell>{c.businessType}</TableCell>
                <TableCell>{c.address?.city}</TableCell>
                <TableCell>{c.gstNumber || 'N/A'}</TableCell>
                <TableCell><Chip label={c.verificationStatus} size="small" color={c.verificationStatus === 'approved' ? 'success' : 'warning'} /></TableCell>
                <TableCell>
                  {c.verificationStatus === 'pending' && (
                    <ButtonGroup size="small">
                      <Button color="success" onClick={() => handleApprove(c._id, 'approved')}>Approve</Button>
                      <Button color="error" onClick={() => handleApprove(c._id, 'rejected')}>Reject</Button>
                    </ButtonGroup>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default AdminSellers;
