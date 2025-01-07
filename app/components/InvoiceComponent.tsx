import { Invoice } from '@/type';
import {
  CheckCircle,
  Clock,
  FileText,
  SquareArrowOutUpRight,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type InvoiceComponentProps = {
  invoice: Invoice;
  index: number;
};

const getStatusBadge = (status: number) => {
  switch (status) {
    case 1:
      return (
        <div className="badge badge-lg flex items-center gap-2">
          <FileText className="w-4" />
          Brouillon
        </div>
      );
    case 2:
      return (
        <div className="badge badge-warning badge-lg flex items-center gap-2">
          <Clock className="w-4" />
          En attente
        </div>
      );
    case 3:
      return (
        <div className="badge badge-success badge-lg flex items-center gap-2">
          <CheckCircle className="w-4" />
          Payée
        </div>
      );

    case 4:
      return (
        <div className="badge badge-info badge-lg flex items-center gap-2">
          <XCircle className="w-4" />
          Annulée
        </div>
      );
    case 5:
      return (
        <div className="badge badge-error badge-lg flex items-center gap-2">
          <XCircle className="w-4" />
          Impayée
        </div>
      );
    default:
      return (
        <div className="badge badge-lg">
          <XCircle className="w-4" />
          Indefinis
        </div>
      );
  }
};

const InvoiceComponent: React.FC<InvoiceComponentProps> = ({ invoice }) => {
  const calculateTotal = () => {
    const totalHT = invoice?.lines?.reduce((acc, line) => {
      const quantity = line.quantity ?? 0;
      const unitPrice = line.unitPrice ?? 0;
      return acc + quantity * unitPrice;
    }, 0);

    const totalVAT = totalHT * (invoice.vatRate / 100);
    return totalHT + totalVAT;
  };

  return (
    <div className="space-y-2 rounded-xl bg-base-200/90 p-5 shadow">
      <div className="flex w-full items-center justify-between">
        <div>{getStatusBadge(invoice.status)}</div>
        <Link className="btn btn-accent btn-sm" href={`/invoice/${invoice.id}`}>
          Plus
          <SquareArrowOutUpRight className="w-4" />
        </Link>
      </div>

      <div className="w-full">
        <div>
          <div className="stat-title">
            <div className="text-sm uppercase">FACT-{invoice.id}</div>
          </div>
          <div>
            <div className="stat-value">{calculateTotal().toFixed(0)} xof</div>
          </div>
          <div className="stat-desc">{invoice.name}</div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceComponent;
