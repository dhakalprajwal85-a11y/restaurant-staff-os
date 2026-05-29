"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

export default function WorkerQRCode({
  workerId,
}: {
  workerId: string;
}) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    QRCode.toDataURL(workerId).then(setQr);
  }, [workerId]);

  if (!qr) return null;

  return (
    <div className="mt-4 bg-white p-4 rounded-xl inline-block">
      <img src={qr} alt="Worker QR Code" className="w-32 h-32" />
    </div>
  );
}