// Extracted verbatim from AtraApp.tsx; markup and classes unchanged.
import { useState, type FormEvent } from "react";
import {
  demoCustomers,
  orderStatuses,
  type BatteryOrder,
  type CrmTask,
  type Customer,
  type CustomerType,
  type OrderStatus,
} from "./crm-data";
import { Icon, Header, Modal, EmptyTab, type Page } from "./shared";

export const orderTone: Record<OrderStatus, string> = {
  "ثبت سفارش": "info", "تأیید قیمت": "warning", "مونتاژ": "purple", "کنترل کیفیت": "info", "آماده تحویل": "success", "تحویل‌شده": "success", "انتظار قطعه": "danger", "تحویل جزئی": "warning", "لغوشده": "danger",
};

export function OrderForm({ customers, onSave, onClose }: { customers: Customer[]; onSave: (order: BatteryOrder) => void; onClose: () => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      id: `سفارش ${String(Date.now()).slice(-4)}`,
      customerId: String(form.get("customerId")),
      batteryModel: String(form.get("batteryModel")),
      quantity: Number(form.get("quantity")),
      amount: String(form.get("amount")),
      deliveryDate: String(form.get("deliveryDate")),
      status: "ثبت سفارش",
    });
  }
  return <Modal title="ثبت سفارش باتری" description="سفارش جدید با وضعیت «ثبت سفارش» وارد جریان کار می‌شود." onClose={onClose}>
    <form className="crm-form" onSubmit={submit}>
      <label className="form-wide"><span>مشتری</span><select name="customerId" required>{customers.map((customer) => <option value={customer.id} key={customer.id}>{customer.name}</option>)}</select></label>
      <label><span>مدل باتری</span><input name="batteryModel" required placeholder="مثلاً لیفتراک L-24"/></label>
      <label><span>تعداد</span><input name="quantity" type="number" min="1" required defaultValue="1"/></label>
      <label><span>مبلغ</span><input name="amount" required placeholder="مثلاً ۱۲۰ میلیون"/></label>
      <label><span>تاریخ تحویل شمسی</span><input name="deliveryDate" required placeholder="۱۰ آبان ۱۴۰۳"/></label>
      <div className="form-actions"><button type="button" className="outline-button" onClick={onClose}>انصراف</button><button className="primary-button" type="submit"><Icon name="box" size={17}/> ثبت سفارش</button></div>
    </form>
  </Modal>;
}

export function OrdersPage({ orders, customers, onCreate, onStatusChange }: { orders: BatteryOrder[]; customers: Customer[]; onCreate: () => void; onStatusChange: (id: string, status: OrderStatus) => void }) {
  const [statusFilter, setStatusFilter] = useState("همه");
  const filtered = statusFilter === "همه" ? orders : orders.filter((order) => order.status === statusFilter);
  const customerName = (id: string) => customers.find((customer) => customer.id === id)?.name ?? "مشتری نامشخص";
  return <>
    <Header page="سفارش‌ها" onQuickAdd={onCreate}/>
    <main className="content">
      <section className="page-toolbar">
        <div className="toolbar-title"><strong>جریان سفارش‌ها</strong><span>وضعیت هر سفارش را مستقیماً به‌روزرسانی کنید.</span></div>
        <label className="toolbar-filter"><Icon name="filter" size={17}/><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>همه</option>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        <button className="primary-button" onClick={onCreate}><Icon name="plus" size={17}/> ثبت سفارش</button>
      </section>
      <section className="order-stats">
        <div><span>کل سفارش‌ها</span><strong>{orders.length}</strong></div><div><span>در حال تولید</span><strong>{orders.filter((order) => ["مونتاژ", "کنترل کیفیت"].includes(order.status)).length}</strong></div><div><span>آماده تحویل</span><strong>{orders.filter((order) => order.status === "آماده تحویل").length}</strong></div><div><span>متوقف</span><strong className="danger-text">{orders.filter((order) => order.status === "انتظار قطعه").length}</strong></div>
      </section>
      <section className="panel data-panel">
        <div className="data-panel-head"><div><h2>فهرست سفارش‌های باتری</h2><p>تمام مبالغ و مشتریان این صفحه ساختگی هستند.</p></div><span className="demo-label">نسخه نمایشی</span></div>
        <div className="crm-table order-table">
          <div className="crm-table-head"><span>شماره و مشتری</span><span>مدل باتری</span><span>تعداد</span><span>مبلغ</span><span>تاریخ تحویل</span><span>وضعیت سفارش</span></div>
          {filtered.map((order) => <div className="crm-table-row" key={order.id}>
            <span className="order-identity"><strong>{order.id}</strong><small>{customerName(order.customerId)}</small></span><span>{order.batteryModel}</span><span>{order.quantity} عدد</span><span>{order.amount} تومان</span><span>{order.deliveryDate}</span>
            <span><select className={`status-select ${orderTone[order.status]}`} value={order.status} onChange={(event) => onStatusChange(order.id, event.target.value as OrderStatus)}>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></span>
          </div>)}
        </div>
      </section>
    </main>
  </>;
}
