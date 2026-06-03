import { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import { inquiryAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    inquiryAPI.getAll().then(({ data }) => setInquiries(data.data.inquiries));
  }, []);

  return (
    <>
      <PageHeader title="Inquiry Monitoring" subtitle="Monitor all platform inquiries" />
      <Paper>
        <Table>
          <TableHead><TableRow><TableCell>Subject</TableCell><TableCell>Product</TableCell><TableCell>Buyer</TableCell><TableCell>Supplier</TableCell><TableCell>Status</TableCell><TableCell>Date</TableCell></TableRow></TableHead>
          <TableBody>
            {inquiries.map((inq) => (
              <TableRow key={inq._id}>
                <TableCell>{inq.subject}</TableCell>
                <TableCell>{inq.product?.name}</TableCell>
                <TableCell>{inq.buyer?.name}</TableCell>
                <TableCell>{inq.company?.companyName}</TableCell>
                <TableCell><Chip label={inq.status} size="small" /></TableCell>
                <TableCell>{new Date(inq.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default AdminInquiries;
