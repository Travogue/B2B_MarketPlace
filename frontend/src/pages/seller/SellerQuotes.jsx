import { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import { quotationAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const SellerQuotes = () => {
  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    quotationAPI.getMy().then(({ data }) => setQuotations(data.data));
  }, []);

  return (
    <>
      <PageHeader title="Quote Management" subtitle="Track sent quotations" />
      <Paper>
        <Table>
          <TableHead><TableRow><TableCell>Product</TableCell><TableCell>Unit Price</TableCell><TableCell>Qty</TableCell><TableCell>Total</TableCell><TableCell>Valid Until</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
          <TableBody>
            {quotations.map((q) => (
              <TableRow key={q._id}>
                <TableCell>{q.product?.name}</TableCell>
                <TableCell>₹{q.unitPrice?.toLocaleString()}</TableCell>
                <TableCell>{q.quantity}</TableCell>
                <TableCell>₹{q.totalPrice?.toLocaleString()}</TableCell>
                <TableCell>{new Date(q.validUntil).toLocaleDateString()}</TableCell>
                <TableCell><Chip label={q.status} size="small" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default SellerQuotes;
