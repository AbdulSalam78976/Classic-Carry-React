import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Export data to CSV
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Export data to PDF
export const exportToPDF = (data, title, filename) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  
  // Add generation date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Prepare table data
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(header => row[header]));
  
  // Add table
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [139, 115, 85], // Brand color
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });
  
  doc.save(`${filename}.pdf`);
};

// Format currency for exports
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Format date for exports
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Prepare sales data for export
export const prepareSalesDataForExport = (salesData) => {
  return salesData.map(item => ({
    Date: formatDate(item._id),
    Orders: item.orders,
    Revenue: formatCurrency(item.revenue),
    'Average Order Value': formatCurrency(item.avgOrderValue || 0)
  }));
};

// Prepare product data for export
export const prepareProductDataForExport = (productData) => {
  return productData.map(item => ({
    'Product Name': item.name,
    'Total Sold': item.totalSold,
    Revenue: formatCurrency(item.revenue),
    'Average Price': formatCurrency(item.avgPrice || 0)
  }));
};

// Prepare user data for export
export const prepareUserDataForExport = (userData) => {
  return userData.map(item => ({
    Email: item._id,
    'Total Orders': item.totalOrders,
    'Total Spent': formatCurrency(item.totalSpent),
    'Average Order Value': formatCurrency(item.avgOrderValue),
    'First Order': formatDate(item.firstOrder),
    'Last Order': formatDate(item.lastOrder)
  }));
};

// Prepare revenue data for export
export const prepareRevenueDataForExport = (revenueData) => {
  return revenueData.map(item => ({
    Date: formatDate(item._id),
    Revenue: formatCurrency(item.revenue),
    Orders: item.orders,
    'Average Order Value': formatCurrency(item.avgOrderValue)
  }));
};