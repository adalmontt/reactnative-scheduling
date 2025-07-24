export const formatNumberWithDots = (number) => {
  return new Intl.NumberFormat('es-ES').format(number);
};


export const formatDate = (dateInput) => {
  const date = new Date(dateInput);

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return ''; // return empty string if invalid
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatNumberWithDotsInput = (value) => {
  const digitsOnly = value.replace(/\D/g, ''); // keep only digits
  return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const removeDots = (value) => {
  return value.replace(/\./g, '');
};



export const sortByDate = (data, key = 'fecha', direction = 'asc') => {
  return data.sort((a, b) => {
    const parseDate = (d) => {
      if (typeof d !== 'string') return new Date(d);

      if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
        const [day, month, year] = d.split('/');
        return new Date(`${year}-${month}-${day}`);
      }

      return new Date(d); // fallback for ISO or timestamp
    };

    const dateA = parseDate(a[key]);
    const dateB = parseDate(b[key]);

    return direction === 'desc' ? dateB - dateA : dateA - dateB;
  });
};



export const groupByMonthYear = (data, key = 'fecha') => {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const parseDate = (d) => {
    if (typeof d !== 'string') return new Date(d);
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
      const [day, month, year] = d.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    return new Date(d);
  };

  const groups = {};

  data.forEach(item => {
    const date = parseDate(item[key]);
    const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(item);
  });

  return Object.keys(groups).map(title => ({
    title,
    data: groups[title].sort((a, b) => parseDate(a[key]) - parseDate(b[key]))
  }));
};
