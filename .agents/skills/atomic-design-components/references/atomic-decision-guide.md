# Atomic Design Decision Guide

Extended reference for classifying ambiguous components.

## Hard Cases

### Is it an Atom or Molecule?

| Component | Classification | Reason |
|---|---|---|
| `Tag` / `Chip` | Atom | Single visual element, text only |
| `Badge` | Atom | Single visual element, number/text only |
| `Dropdown` | Molecule | Composes Button + List atoms |
| `Select` | Atom | Single responsibility, self-contained |
| `Tooltip` | Atom | Single visual element |
| `Modal` | Molecule | Composes Overlay + Header + Content + Footer |
| `Accordion` | Molecule | Composes multiple Header + Content pairs |
| `Tabs` | Molecule | Composes multiple Button atoms |
| `Stepper` | Molecule | Composes multiple Step atoms with connector |
| `ProgressBar` | Atom | Single visual element |
| `Avatar` | Atom | Single visual element |
| `AvatarGroup` | Molecule | Composes multiple Avatar atoms |

## Spybee-Specific Components

| Component | Level | Reason |
|---|---|---|
| `StatusChip` | Atom | Single visual element, variant determines color |
| `IncidentCard` | Molecule | Composes StatusChip + Text + Badge atoms |
| `PriorityIndicator` | Atom | 4px colored bar, single responsibility |
| `MapMarker` | Atom | Single visual element |
| `FilterChip` | Atom | Single visual element, toggle state |
| `SearchInput` | Molecule | Composes Input + Icon atoms |
| `MetricCard` | Molecule | Composes Icon + Text atoms |
| `DataTable` | Organism | Complex composition — dev assembles |
| `Sidebar` | Organism | Complex composition — dev assembles |
