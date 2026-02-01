# Form field vs API mutator / picker name audit

API mutators use **Id** suffix for entity references (e.g. `organizationId`, `locationId`, `beverageId`). Forms should use the same field names so there are no mismatches.

## API mutator field names (from `@brewskey/js-api`)

| Mutator         | Entity reference fields                          | Other fields (examples)                       |
| --------------- | ------------------------------------------------ | --------------------------------------------- |
| LocationMutator | `organizationId`                                 | name, locationType, state, street, city, …    |
| DeviceMutator   | `locationId`                                     | deviceStatus, nfcStatus, secondsToStayOpen, … |
| TapMutator      | `deviceId`, `locationId`                         | description, isPaymentEnabled, …              |
| KegMutator      | `beverageId`                                     | kegType, startingPercentage, tapId            |
| BeverageMutator | `availableId`, `glasswareId`, `srmId`, `styleId` | beverageType, name, servingTemperature, …     |

## Current form / picker usage

| Form / screen | Picker/Dropdown                                          | Current `name`      | API / form type field | Status                              |
| ------------- | -------------------------------------------------------- | ------------------- | --------------------- | ----------------------------------- |
| LocationForm  | OrganizationPicker                                       | `organization`      | `organizationId`      | **MISMATCH** → use `organizationId` |
| LocationForm  | LocationTypePicker                                       | `locationType`      | `locationType`        | OK                                  |
| LocationForm  | StatePicker                                              | `state`             | `state`               | OK                                  |
| DeviceForm    | LocationPicker                                           | `location`          | `locationId`          | **MISMATCH** → use `locationId`     |
| DeviceForm    | DropdownInput (device status)                            | `deviceStatus`      | `deviceStatus`        | OK                                  |
| DeviceForm    | DeviceTimeOpenPicker                                     | `secondsToStayOpen` | `secondsToStayOpen`   | OK                                  |
| DeviceForm    | DeviceNFCStatusPicker                                    | `nfcStatus`         | `nfcStatus`           | OK                                  |
| TapForm       | DropdownInput (device)                                   | `deviceId`          | `deviceId`            | OK                                  |
| KegForm       | BeveragePicker                                           | `beverage`          | `beverageId`          | **MISMATCH** → use `beverageId`     |
| KegForm       | DropdownInput (keg type)                                 | `kegType`           | `kegType`             | OK                                  |
| BeverageForm  | AvailabilityPicker                                       | `availability`      | `availableId`         | **MISMATCH** → use `availableId`    |
| BeverageForm  | GlassPicker                                              | `glass`             | `glasswareId`         | **MISMATCH** → use `glasswareId`    |
| BeverageForm  | SrmPicker                                                | `srm`               | `srmId`               | **MISMATCH** → use `srmId`          |
| BeverageForm  | StylePicker                                              | `style`             | `styleId`             | **MISMATCH** → use `styleId`        |
| BeverageForm  | BeverageTypePicker, YearPicker, ServingTemperaturePicker | same as API         | OK                    |
| NUX location  | LocationPicker                                           | `location`          | FormData `locationId` | **MISMATCH** → use `locationId`     |
| Settings      | OrganizationPicker                                       | `organization`      | UI only (no mutator)  | OK to keep `organization`           |

## Summary

- **Match API Id fields:** LocationForm (`organizationId`), DeviceForm (`locationId`), KegForm (`beverageId`), BeverageForm (`availableId`, `glasswareId`, `srmId`, `styleId`), NUX location (`locationId`).
- **No change:** TapForm deviceId, all non-entity pickers (state, locationType, deviceStatus, nfcStatus, secondsToStayOpen, kegType, beverageType, etc.), Settings organization (UI-only).

## Fixes applied

| Form / screen | Change                                                                                                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LocationForm  | FormProps = LocationMutator; picker `name="organizationId"`; defaultValues.organizationId; onSubmit(formValues) (no extract).                                                |
| DeviceForm    | FormProps = DeviceMutator; picker `name="locationId"`; defaultValues.locationId; validate locationId; onSubmit(formValues).                                                  |
| KegForm       | FormFields = KegMutator; picker `name="beverageId"`; defaultValues.beverageId; onSubmit(values) (no transformValues).                                                        |
| BeverageForm  | FormProps = BeverageMutator & { beverageImage? }; pickers `name="availableId"`, `glasswareId`, `srmId`, `styleId`; defaultValues.\*Id; validate srmId; onSubmit(formValues). |
| NUX location  | LocationPicker `name="locationId"` (FormData already has locationId).                                                                                                        |
| Settings      | No change (organization is UI-only, not a mutator field).                                                                                                                    |
