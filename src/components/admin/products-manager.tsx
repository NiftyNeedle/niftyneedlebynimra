"use client";

import {
  useActionState,
  useEffect,
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { Copy, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  type Product,
  type ProductCustomization,
  type CustomizationOption,
  ALL_CUSTOMIZATION,
} from "@/lib/types";
import { DEFAULT_YARN_OPTIONS, DEFAULT_SIZE_OPTIONS } from "@/lib/customization";
import { categories } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { upsertProduct, deleteProduct, type ActionState } from "@/app/admin/products/actions";

const field =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";
const label = "mb-1.5 block text-sm font-medium text-foreground";

const editableCategories = categories.filter((c) => c.slug !== "custom-orders");

export function ProductsManager({ products }: { products: Product[] }) {
  const router = useRouter();
  const toast = useToast();
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [duplicateFrom, setDuplicateFrom] = useState<Product | null>(null);
  const [isDeleting, startDelete] = useTransition();

  const openAdd = () => {
    setEditing(null);
    setDuplicateFrom(null);
    setShowForm(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setDuplicateFrom(null);
    setShowForm(true);
  };
  const openDuplicate = (p: Product) => {
    setEditing(null);
    setDuplicateFrom(p);
    setShowForm(true);
  };

  const handleDelete = (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    startDelete(async () => {
      const res = await deleteProduct(p.id);
      if (res.error) toast(res.error, "info");
      else {
        toast(`Deleted ${p.name}`);
        router.refresh();
      }
    });
  };

  const base = editing ?? duplicateFrom;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Products
          </h1>
          <p className="text-sm text-muted">{products.length} products</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          Add product
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)]">
        <table className="w-full min-w-[42rem] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-4 font-medium">Product</th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Price</th>
              <th className="px-5 py-4 font-medium">Stock</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border last:border-0 hover:bg-surface-muted/40"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-cover bg-center"
                      style={
                        p.imageUrl
                          ? { backgroundImage: `url(${p.imageUrl})` }
                          : { background: p.swatch }
                      }
                    />
                    <span className="font-medium text-foreground">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 capitalize text-muted">
                  {p.categorySlug.replace(/-/g, " ")}
                </td>
                <td className="px-5 py-4 font-medium text-foreground">
                  {formatPrice(p.salePrice ?? p.price, p.currency)}
                </td>
                <td className="px-5 py-4 text-muted">
                  {p.inStock ? "In stock" : "Out of stock"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      aria-label="Edit"
                      onClick={() => openEdit(p)}
                      className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface-muted"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Duplicate"
                      onClick={() => openDuplicate(p)}
                      className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface-muted"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Delete"
                      disabled={isDeleting}
                      onClick={() => handleDelete(p)}
                      className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface-muted hover:text-accent disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm
          key={editing?.id ?? duplicateFrom?.id ?? "new"}
          editing={editing}
          base={base}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function ProductForm({
  editing,
  base,
  onClose,
  onSaved,
}: {
  editing: Product | null;
  base: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [customizable, setCustomizable] = useState<boolean>(
    base ? Boolean(base.customizable) : false,
  );
  const czDefaults: ProductCustomization = base?.customization ?? ALL_CUSTOMIZATION;

  const [cz, setCz] = useState({
    color: Boolean(czDefaults.color),
    yarn: Boolean(czDefaults.yarn),
    size: Boolean(czDefaults.size),
    name: Boolean(czDefaults.name),
    giftMessage: Boolean(czDefaults.giftMessage),
    instructions: Boolean(czDefaults.instructions),
  });
  const [colorOptions, setColorOptions] = useState<CustomizationOption[]>(
    base?.customization?.colorOptions?.length
      ? base.customization.colorOptions
      : (base?.colors ?? []).map((c) => ({ label: c, price: 0 })),
  );
  const [yarnOptions, setYarnOptions] = useState<CustomizationOption[]>(
    base?.customization?.yarnOptions?.length
      ? base.customization.yarnOptions
      : DEFAULT_YARN_OPTIONS,
  );
  const [sizeOptions, setSizeOptions] = useState<CustomizationOption[]>(
    base?.customization?.sizeOptions?.length
      ? base.customization.sizeOptions
      : DEFAULT_SIZE_OPTIONS,
  );

  const setczKey = (key: keyof typeof cz, val: boolean) =>
    setCz((prev) => ({ ...prev, [key]: val }));

  const builtCustomization: ProductCustomization | null = customizable
    ? {
        color: cz.color,
        ...(cz.color ? { colorOptions } : {}),
        yarn: cz.yarn,
        ...(cz.yarn ? { yarnOptions } : {}),
        size: cz.size,
        ...(cz.size ? { sizeOptions } : {}),
        name: cz.name,
        giftMessage: cz.giftMessage,
        instructions: cz.instructions,
      }
    : null;

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    upsertProduct,
    {},
  );

  useEffect(() => {
    if (state.ok) {
      toast(editing ? "Product updated" : "Product added");
      onSaved();
    } else if (state.error) {
      toast(state.error, "info");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto overflow-x-hidden bg-espresso/40 p-3 backdrop-blur-sm sm:p-4">
      <form
        action={formAction}
        className="my-6 max-h-[92vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-lift)] sm:my-8 md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-foreground">
            {editing ? "Edit product" : "Add product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-muted"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {editing && <input type="hidden" name="id" value={editing.id} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={label}>Name *</label>
            <input name="name" required defaultValue={base?.name} className={field} />
          </div>

          <div>
            <label className={label}>URL slug (optional)</label>
            <input
              name="slug"
              defaultValue={editing?.slug}
              placeholder="auto from name"
              className={field}
            />
          </div>
          <div>
            <label className={label}>Category</label>
            <select
              name="category_slug"
              defaultValue={base?.categorySlug ?? editableCategories[0].slug}
              className={field}
            >
              {editableCategories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={label}>Price *</label>
            <input
              name="price"
              type="number"
              step="0.01"
              required
              defaultValue={base?.price}
              className={field}
            />
          </div>
          <div>
            <label className={label}>Sale price (optional)</label>
            <input
              name="salePrice"
              type="number"
              step="0.01"
              defaultValue={base?.salePrice}
              className={field}
            />
          </div>

          <div>
            <label className={label}>Currency</label>
            <input name="currency" defaultValue={base?.currency ?? "USD"} className={field} />
          </div>

          <div className="sm:col-span-2">
            <label className={label}>Short description</label>
            <textarea
              name="short_description"
              rows={2}
              defaultValue={base?.shortDescription}
              className={field}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={label}>Materials (comma-separated)</label>
            <input
              name="materials"
              defaultValue={base?.materials.join(", ")}
              placeholder="Cotton yarn"
              className={field}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={label}>Product photo</label>
            {base?.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={base.imageUrl}
                alt=""
                className="mb-2 h-24 w-24 rounded-xl object-cover"
              />
            )}
            <input
              name="image"
              type="file"
              accept="image/*"
              className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
            />
            <p className="mt-1 text-xs text-muted">
              {editing
                ? "Leave empty to keep the current photo."
                : "Optional — a colour swatch is used if no photo is added."}
            </p>
          </div>

          <input
            type="hidden"
            name="swatch"
            defaultValue={base?.swatch ?? ""}
          />

          <div className="sm:col-span-2 grid grid-cols-2 gap-3 rounded-2xl bg-surface-muted/50 p-4 sm:grid-cols-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="in_stock"
                defaultChecked={base ? base.inStock : true}
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
              In stock
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="customizable"
                defaultChecked={Boolean(base?.customizable)}
                onChange={(e) => setCustomizable(e.target.checked)}
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
              Customizable
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="is_best_seller"
                defaultChecked={Boolean(base?.isBestSeller)}
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
              Best seller
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="is_new"
                defaultChecked={Boolean(base?.isNew)}
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
              New arrival
            </label>
          </div>

          {customizable && (
            <div className="sm:col-span-2 space-y-4 rounded-2xl border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Customization options shown to customers
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  Tick what this product should offer, then list the choices for
                  each (with an optional extra price).
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {(
                  [
                    { key: "color", label: "Choose colour" },
                    { key: "yarn", label: "Choose yarn type" },
                    { key: "size", label: "Choose size" },
                    { key: "name", label: "Personalised name" },
                    { key: "giftMessage", label: "Gift message" },
                    { key: "instructions", label: "Special instructions" },
                  ] as { key: keyof typeof cz; label: string }[]
                ).map((o) => (
                  <label key={o.key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={cz[o.key]}
                      onChange={(e) => setczKey(o.key, e.target.checked)}
                      className="h-4 w-4 accent-[var(--color-primary)]"
                    />
                    {o.label}
                  </label>
                ))}
              </div>

              {cz.color && (
                <OptionListEditor
                  title="Colour choices"
                  options={colorOptions}
                  setOptions={setColorOptions}
                />
              )}
              {cz.yarn && (
                <OptionListEditor
                  title="Yarn choices"
                  options={yarnOptions}
                  setOptions={setYarnOptions}
                />
              )}
              {cz.size && (
                <OptionListEditor
                  title="Size choices"
                  options={sizeOptions}
                  setOptions={setSizeOptions}
                />
              )}
            </div>
          )}

          <input
            type="hidden"
            name="customization"
            value={JSON.stringify(builtCustomization)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
          >
            {pending ? "Saving…" : editing ? "Save changes" : "Add product"}
          </button>
        </div>
      </form>
    </div>
  );
}

function OptionListEditor({
  title,
  options,
  setOptions,
}: {
  title: string;
  options: CustomizationOption[];
  setOptions: Dispatch<SetStateAction<CustomizationOption[]>>;
}) {
  const update = (i: number, patch: Partial<CustomizationOption>) =>
    setOptions((prev) => prev.map((o, j) => (j === i ? { ...o, ...patch } : o)));
  const remove = (i: number) =>
    setOptions((prev) => prev.filter((_, j) => j !== i));
  const add = () => setOptions((prev) => [...prev, { label: "", price: 0 }]);

  return (
    <div className="rounded-xl bg-surface-muted/50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <button
          type="button"
          onClick={add}
          className="text-xs font-medium text-accent hover:underline"
        >
          + Add option
        </button>
      </div>
      <div className="space-y-2">
        {options.map((o, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={o.label}
              onChange={(e) => update(i, { label: e.target.value })}
              placeholder="Option name"
              className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="relative w-20 shrink-0 sm:w-28">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted">
                +$
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={o.price}
                onChange={(e) => update(i, { price: Number(e.target.value) })}
                className="w-full rounded-lg border border-border bg-surface py-2 pl-7 pr-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove option"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted hover:bg-surface hover:text-accent"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        {options.length === 0 && (
          <p className="text-xs text-muted">No options yet — add at least one.</p>
        )}
      </div>
      <p className="mt-2 text-xs text-muted">
        The first option is the default. Price is added to the base price.
      </p>
    </div>
  );
}
