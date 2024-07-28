import { z, ZodSchema } from "zod";

const FormDataEntryValueSchema = z
  .union([z.string(), z.instanceof(File)])
  .nullable();

function formData() {
  return z.instanceof(FormData).transform((formData) => {
    const entries: Array<[string, FormDataEntryValue | FormDataEntryValue[]]> =
      [];

    for (const key of formData.keys()) {
      const value = formData.getAll(key);
      if (value.length <= 0) continue;
      if (value.length === 1) entries.push([key, value[0]]);
      else entries.push([key, value]);
    }

    return z
      .array(
        z.tuple([
          z.string(),
          FormDataEntryValueSchema.or(FormDataEntryValueSchema.array()),
        ]),
      )
      .transform((entries) => Object.fromEntries(entries))
      .parse(entries);
  });
}

export function parseFormBody<T>(schema: ZodSchema<T>, data: FormData) {
  return formData().pipe(schema).parse(data);
}
