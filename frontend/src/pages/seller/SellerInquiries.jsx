import { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { toast } from 'react-toastify';
import { inquiryAPI, quotationAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const SellerInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [quote, setQuote] = useState({ unitPrice: '', quantity: '', validUntil: '', deliveryTime: '', notes: '' });

  useEffect(() => {
    inquiryAPI.getMy().then(({ data }) => setInquiries(data.data.inquiries));
  }, []);

  const handleQuote = async () => {
    try {
      await quotationAPI.create({
        inquiry: selectedInquiry._id,
        unitPrice: Number(quote.unitPrice),
        quantity: Number(quote.quantity),
        validUntil: quote.validUntil,
        deliveryTime: quote.deliveryTime,
        notes: quote.notes,
      });
      toast.success('Quotation sent!');
      setQuoteOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send quote');
    }
  };

  return (
    <>
      <PageHeader title="Manage Inquiries" subtitle="Respond to buyer RFQ requests" />
      <Paper>
        <Table>
          <TableHead><TableRow><TableCell>Subject</TableCell><TableCell>Product</TableCell><TableCell>Buyer</TableCell><TableCell>Qty</TableCell><TableCell>Status</TableCell><TableCell>Action</TableCell></TableRow></TableHead>
          <TableBody>
            {inquiries.map((inq) => (
              <TableRow key={inq._id}>
                <TableCell>{inq.subject}</TableCell>
                <TableCell>{inq.product?.name}</TableCell>
                <TableCell>{inq.buyer?.name}</TableCell>
                <TableCell>{inq.quantity}</TableCell>
                <TableCell><Chip label={inq.status} size="small" /></TableCell>
                <TableCell>
                  {inq.status === 'open' && (
                    <Button size="small" variant="outlined" onClick={() => { setSelectedInquiry(inq); setQuote({ ...quote, quantity: inq.quantity }); setQuoteOpen(true); }}>
                      Send Quote
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={quoteOpen} onClose={() => setQuoteOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Quotation</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Unit Price (₹)" type="number" margin="normal" value={quote.unitPrice} onChange={(e) => setQuote({ ...quote, unitPrice: e.target.value })} />
          <TextField fullWidth label="Quantity" type="number" margin="normal" value={quote.quantity} onChange={(e) => setQuote({ ...quote, quantity: e.target.value })} />
          <TextField fullWidth label="Valid Until" type="date" margin="normal" InputLabelProps={{ shrink: true }} value={quote.validUntil} onChange={(e) => setQuote({ ...quote, validUntil: e.target.value })} />
          <TextField fullWidth label="Delivery Time" margin="normal" value={quote.deliveryTime} onChange={(e) => setQuote({ ...quote, deliveryTime: e.target.value })} />
          <TextField fullWidth label="Notes" multiline rows={3} margin="normal" value={quote.notes} onChange={(e) => setQuote({ ...quote, notes: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuoteOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleQuote}>Send Quotation</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SellerInquiries;
