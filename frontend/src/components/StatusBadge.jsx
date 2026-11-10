import { getStatusColor } from "../utils/managerUtils";

const StatusBadge = ({ status, type = 'order', className = '' }) => {
  const colors = getStatusColor(status, type);

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${className}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.text + '20'
      }}
    >
      {colors.label}
    </span>
  );
};

export default StatusBadge;
