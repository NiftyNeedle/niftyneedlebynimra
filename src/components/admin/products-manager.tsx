"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Copy, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  type Product,
  type ProductCustomization,
  type CustomizationFieldType,
  MAX_PRODUCT_IMAGES,
} from "@/lib/types";
import {
  CUSTOMIZATION_FIELD_TYPES,
  FIELD_PRESETS,
  type DraftField,
  type DraftOption,
  customizationFields,
  draftFromField,
  draftFromPreset,
  fieldFromDraft,
  isUsableField,
} from "@/lib/customization";
import type { Category } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { upsertProduct, deleteProduct, type ActionState } from "@/app/admin/products/actions";

const field =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";
const label = "mb-1.5 block text-sm font-medium text-foreground";

export function ProductsManager({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const editableCategories = categories.filter(
    (c) => c.slug !== "custom-orders",
  );
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
          categories={editableCategories}
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
  categories: editableCategories,
  onClose,
  onSaved,
}: {
  editing: Product | null;
  base: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [customizable, setCustomizable] = useState<boolean>(
    base ? Boolean(base.customizable) : false,
  );
  // The product's own customization fields. Legacy products (fixed
  // colour/yarn/size flags) are converted to fields on open, so editing
  // one migrates it to the dynamic shape on save.
  const [czFields, setCzFields] = useState<DraftField[]>(() =>
    customizationFields(base ?? {}).map(draftFromField),
  );

  // ── Photo gallery (max MAX_PRODUCT_IMAGES) ─────────────────────────
  // `keptImages` are already-uploaded URLs the admin wants to keep; they
  // go back as hidden `existingImages` fields. `newFiles` are the pending
  // uploads, mirrored into the file input so removals actually stick.
  const [keptImages, setKeptImages] = useState<string[]>(() =>
    (base?.images ?? []).map((i) => i.url).filter(Boolean),
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const remaining = MAX_PRODUCT_IMAGES - keptImages.length - newFiles.length;

  const newPreviews = useMemo(
    () => newFiles.map((f) => URL.createObjectURL(f)),
    [newFiles],
  );
  useEffect(
    () => () => newPreviews.forEach((u) => URL.revokeObjectURL(u)),
    [newPreviews],
  );

  const setPendingFiles = (files: File[]) => {
    setNewFiles(files);
    // Rewrite the input's FileList so the form submits exactly this set.
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      files.forEach((f) => dt.items.add(f));
      fileInputRef.current.files = dt.files;
    }
  };

  const onPickFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    const room = Math.max(0, remaining);
    if (picked.length > room) {
      toast(
        `Up to ${MAX_PRODUCT_IMAGES} photos per product — the extra files were skipped.`,
        "info",
      );
    }
    setPendingFiles([...newFiles, ...picked.slice(0, room)]);
  };

  const photoSlots = [
    ...keptImages.map((url, i) => ({
      key: `kept-${i}-${url}`,
      src: url,
      pending: false,
      remove: () => setKeptImages(keptImages.filter((_, j) => j !== i)),
    })),
    ...newFiles.map((f, i) => ({
      key: `new-${i}-${f.name}`,
      src: newPreviews[i],
      pending: true,
      remove: () => setPendingFiles(newFiles.filter((_, j) => j !== i)),
    })),
  ];

  const builtCustomization: ProductCustomization | null = customizable
    ? { fields: czFields.map(fieldFromDraft).filter(isUsableField) }
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
        className="my-4 max-h-[94dvh] w-full max-w-2xl overflow-y-auto overflow-x-hidden rounded-3xl border border-border bg-surface p-4 shadow-[var(--shadow-lift)] sm:my-8 sm:p-6 md:p-8"
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

        <div className="grid gap-4 [&>*]:min-w-0 sm:grid-cols-2">
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
              defaultValue={base?.categorySlug ?? editableCategories[0]?.slug}
              className={field}
            >
              {editableCategories.length === 0 && (
                <option value="">No categories yet — add one first</option>
              )}
              {editableCategories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={label}>Price (€) *</label>
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
            <label className={label}>Sale price (€, optional)</label>
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
            <input type="hidden" name="currency" value="EUR" />
            <p className="rounded-xl border border-border bg-surface-muted/50 px-4 py-2.5 text-sm text-muted">
              Euro (€) — the storefront converts to the visitor&apos;s currency.
            </p>
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
            <label className={label}>
              Product photos{" "}
              <span className="font-normal text-muted">
                (up to {MAX_PRODUCT_IMAGES})
              </span>
            </label>

            {photoSlots.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2.5">
                {photoSlots.map((s, i) => (
                  <div key={s.key} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.src}
                      alt=""
                      className="h-24 w-24 rounded-xl border border-border object-cover"
                    />
                    <button
                      type="button"
                      onClick={s.remove}
                      aria-label="Remove photo"
                      className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-espresso text-white shadow-sm transition-colors hover:bg-accent"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 rounded-full bg-espresso/80 px-1.5 py-0.5 text-[0.6rem] font-medium text-white">
                      {i === 0 ? "Cover" : s.pending ? "New" : i + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Photos kept on save — anything removed above is dropped. */}
            {keptImages.map((url, i) => (
              <input
                key={`${i}-${url}`}
                type="hidden"
                name="existingImages"
                value={url}
              />
            ))}

            <input
              ref={fileInputRef}
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={onPickFiles}
              className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
            />
            <p className="mt-1 text-xs text-muted">
              {remaining > 0
                ? `Add up to ${remaining} more — the first photo is the cover, and customers page through the rest with arrows.`
                : `Limit reached (${MAX_PRODUCT_IMAGES} photos). Remove one to add another.`}
              {photoSlots.length === 0 &&
                " A colour swatch is used if no photo is added."}
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
            <div className="min-w-0 space-y-4 rounded-2xl border border-border p-3 sm:col-span-2 sm:p-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  What can customers customize?
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  Add a field for anything this product needs — flower type,
                  pattern, size, a name to embroider. A field is either a set
                  of choices (each with an optional extra price) or a box the
                  customer types in.
                </p>
              </div>
              <CustomizationFieldsEditor
                fields={czFields}
                setFields={setCzFields}
              />
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

function CustomizationFieldsEditor({
  fields,
  setFields,
}: {
  fields: DraftField[];
  setFields: Dispatch<SetStateAction<DraftField[]>>;
}) {
  const update = (i: number, patch: Partial<DraftField>) =>
    setFields((prev) => prev.map((f, j) => (j === i ? { ...f, ...patch } : f)));

  const remove = (i: number) =>
    setFields((prev) => prev.filter((_, j) => j !== i));

  const move = (i: number, dir: -1 | 1) =>
    setFields((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const add = (preset?: (typeof FIELD_PRESETS)[number]) =>
    setFields((prev) => [...prev, draftFromPreset(preset)]);

  const setOptions =
    (i: number): Dispatch<SetStateAction<DraftOption[]>> =>
    (value) =>
      setFields((prev) =>
        prev.map((f, j) =>
          j === i
            ? {
                ...f,
                options: typeof value === "function" ? value(f.options) : value,
              }
            : f,
        ),
      );

  return (
    <div className="min-w-0 space-y-3">
      {fields.map((f, i) => (
        <div
          key={f.key}
          className="min-w-0 rounded-xl border border-border bg-surface-muted/40 p-2.5 sm:p-3"
        >
          <div className="flex min-w-0 items-start gap-2">
            <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[1fr_9rem]">
              <input
                value={f.label}
                onChange={(e) => update(i, { label: e.target.value })}
                placeholder="What to customize (e.g. Flower Type)"
                aria-label="Field name"
                className="w-0 min-w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <select
                value={f.type}
                onChange={(e) =>
                  update(i, { type: e.target.value as CustomizationFieldType })
                }
                aria-label="Field type"
                className="w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {CUSTOMIZATION_FIELD_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Move field up"
                className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface hover:text-foreground disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === fields.length - 1}
                aria-label="Move field down"
                className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface hover:text-foreground disabled:opacity-30"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Remove field"
                className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface hover:text-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {f.type === "choice" ? (
            <OptionListEditor
              title={`${f.label.trim() || "Field"} choices`}
              options={f.options}
              setOptions={setOptions(i)}
            />
          ) : (
            <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
              <input
                value={f.placeholder}
                onChange={(e) => update(i, { placeholder: e.target.value })}
                placeholder="Hint shown inside the box (optional)"
                aria-label="Placeholder"
                className="w-0 min-w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <label className="flex items-center gap-2 whitespace-nowrap text-sm">
                <input
                  type="checkbox"
                  checked={f.required}
                  onChange={(e) => update(i, { required: e.target.checked })}
                  className="h-4 w-4 accent-[var(--color-primary)]"
                />
                Required
              </label>
            </div>
          )}
        </div>
      ))}

      {fields.length === 0 && (
        <p className="text-xs text-muted">
          No customization fields yet — add one below.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => add()}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          Add field
        </button>
        <span className="text-xs text-muted">or start from:</span>
        {FIELD_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => add(p)}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-muted"
          >
            + {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function OptionListEditor({
  title,
  options,
  setOptions,
}: {
  title: string;
  options: DraftOption[];
  setOptions: Dispatch<SetStateAction<DraftOption[]>>;
}) {
  const update = (i: number, patch: Partial<DraftOption>) =>
    setOptions((prev) => prev.map((o, j) => (j === i ? { ...o, ...patch } : o)));
  const remove = (i: number) =>
    setOptions((prev) => prev.filter((_, j) => j !== i));
  const add = () => setOptions((prev) => [...prev, { label: "", price: "" }]);

  return (
    <div className="mt-2 min-w-0 rounded-xl bg-surface-muted/50 p-2.5 sm:p-3">
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
          <div key={i} className="flex min-w-0 items-center gap-2">
            <input
              value={o.label}
              onChange={(e) => update(i, { label: e.target.value })}
              placeholder="Option name"
              className="w-0 min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="relative w-16 shrink-0 sm:w-24">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted">
                +€
              </span>
              {/* Free text so it can be left empty; empty saves as 0. */}
              <input
                type="text"
                inputMode="decimal"
                value={o.price}
                onChange={(e) => update(i, { price: e.target.value })}
                placeholder="0"
                aria-label="Extra price for this option"
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
        The first choice is the default. Leave the price empty (or 0) for no
        extra charge — anything else is added to the base price.
      </p>
    </div>
  );
}
