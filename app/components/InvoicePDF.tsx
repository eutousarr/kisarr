import { Invoice, Totals } from '@/type';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { ArrowDownFromLine, SatelliteDish } from 'lucide-react';
import Image from 'next/image';
import React, { useRef } from 'react';

interface FacturePDFProps {
  invoice: Invoice;
  totals: Totals;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  return date.toLocaleDateString('fr-FR', options);
}

const InvoicePDF: React.FC<FacturePDFProps> = ({ invoice, totals }) => {
  const factureRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const element = factureRef.current;
    if (element) {
      try {
        const canvas = await html2canvas(element, { scale: 3, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'A4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`facture-${invoice.id}-${invoice.name}.pdf`);

        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
          zIndex: 9999,
        });
      } catch (error) {
        console.error('Erreur lors de la génération du PDF :', error);
      }
    }
  };

  return (
    <div className="mt-4 hidden lg:block">
      <div className="rounded-xl border-2 border-dashed border-base-300 p-5">
        <button
          onClick={handleDownloadPdf}
          className="mb4 btn btn-accent btn-sm"
        >
          Facture PDF
          <ArrowDownFromLine className="w-4" />
        </button>

        <div className="p-8" ref={factureRef}>
          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-col">
              <div className="border-1 relative flex items-center rounded-xl">
                <Image
                  src="/taureau1.png"
                  width={64}
                  height={64}
                  alt="Logo Kis@rrw3b"
                  className="bottom-2 z-0 ml-2 border-spacing-2 rounded-full shadow-2xl"
                />
                <div className="z-50 ml-3 text-4xl font-bold italic">
                  Kis@rr<span className="text-orange-500">WEB</span> <br />
                  <span className="text-sm text-slate-500">
                    sarrsindian@gmail.com - 775544191
                  </span>
                </div>
                <div className="absolute right-[10] top-[-36] rounded-3xl bg-transparent p-2 text-orange-500">
                  <SatelliteDish className="h-12 w-12" />
                </div>
              </div>
              <h1 className="mt-4 text-4xl font-bold">Facture</h1>
            </div>
            <div className="text-right uppercase">
              <p className="text-lg badge badge-warning">Facture n° {invoice.id}/{invoice.name}</p>
              <p className="my-2">
                <strong>Date </strong>
                {formatDate(invoice.invoiceDate)}
              </p>
              <p>
                <strong>Date d&apos;échéance </strong>
                {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>

          <div className="my-6 flex justify-between">
            <div>
              <p className="badge badge-ghost mb-2">Émetteur</p>
              <p className="text-sm font-bold italic">{invoice.issuerName}</p>
              <p className="w-52 break-words text-sm text-gray-500">
                {invoice.issuerAddress}
              </p>
            </div>
            <div className="text-right">
              <p className="badge badge-ghost mb-2">Client</p>
              <p className="text-sm font-bold italic">{invoice.clientName}</p>
              <p className="w-52 break-words text-sm text-gray-500">
                {invoice.clientAddress}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th></th>
                  <th>Description</th>
                  <th>Quantité</th>
                  <th>Prix Unitaire</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lines.map((ligne, index) => (
                  <tr key={index + 1}>
                    <td>{index + 1}</td>
                    <td>{ligne.description}</td>
                    <td>{ligne.quantity}</td>
                    <td>{ligne.unitPrice.toFixed(2)} xof</td>
                    <td>{(ligne.quantity * ligne.unitPrice).toFixed(2)} xof</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-md mt-6 space-y-2">
            <div className="flex justify-between">
              <div className="font-bold">Total Hors Taxes</div>
              <div>{totals.totalHT.toFixed(2)} xof</div>
            </div>

            {invoice.vatActive && (
              <div className="flex justify-between">
                <div className="font-bold">TVA {invoice.vatRate} %</div>
                <div>{totals.totalVAT.toFixed(2)} xof</div>
              </div>
            )}

            <div className="flex justify-between">
              <div className="font-bold">Total Toutes Taxes Comprises</div>
              <div className="badge badge-accent">
                {totals.totalTTC.toFixed(2)} xof
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePDF;
