import { useTranslation } from "react-i18next";

export default function RoleModal({ isOpen, onClose, onSelect }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const roles = [
    { label: t("farmer"), value: "farmer" },
    { label: t("buyer"), value: "buyer" },
    { label: t("transporter"), value: "transporter" },
    { label: t("insurer"), value: "insurer" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-10 w-full max-w-lg text-center">
        <h2 className="text-2xl font-bold text-[#132a13] mb-8">
          {t("selectRole")}
        </h2>

        <div className="grid gap-4">
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => onSelect(role.value)}
              className="bg-[#ecf39e] text-[#132a13]
                         py-4 rounded-xl font-semibold
                         hover:bg-[#dde5b6] transition-all"
            >
              {role.label}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 text-sm text-[#31572c] hover:underline"
        >
          {t("cancel") || "Cancel"}
        </button>
      </div>
    </div>
  );
}
