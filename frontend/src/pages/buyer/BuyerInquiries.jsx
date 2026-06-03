import { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import { inquiryAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const BuyerInquiries = () => {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    inquiryAPI.getMy().then(({ data }) => setInquiries(data.data.inquiries));
  }, []);

  return (
    <>
      <PageHeader title="My Inquiries" subtitle="Track your RFQ requests" />
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inquiries.map((inq) => (
              <TableRow key={inq._id}>
                <TableCell>{inq.subject}</TableCell>
                <TableCell>{inq.product?.name}</TableCell>
                <TableCell>{inq.quantity}</TableCell>
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

export default BuyerInquiries;
