const CowInfo = () => {
  const infoSections = [
    { label: "Domain", value: "Eukaryota" },
    { label: "Kingdom", value: "Animalia" },
    { label: "Phylum", value: "Chordata" },
    { label: "Class", value: "Mammalia" },
    { label: "Order", value: "Artiodactyla" },
    { label: "Family", value: "Bovidae" },
    { label: "Genus", value: "Bos" },
    { label: "Scientific Name", value: "Bos Taurus" },
  ];

  return (
    <>
      {infoSections.map((section, index) => (
        <div
          key={index}
          className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700"
        >
          <p className="text-gray-800 dark:text-gray-200">{section.label}</p>
          <p className="text-gray-800 dark:text-gray-200">{section.value}</p>
        </div>
      ))}
    </>
  );
};

export default CowInfo;
