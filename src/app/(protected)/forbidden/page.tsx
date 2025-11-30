export default function ForbiddenPage() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-semibold mb-4">Access Denied</h1>
      <p className="text-muted-foreground">
        You do not have permission to access this resource.
      </p>
    </div>
  );
}
