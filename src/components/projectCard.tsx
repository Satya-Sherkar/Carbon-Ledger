interface ProjectCardProps {
   title: string;
   decscription: string;
   owner: string;
   ownerWalletAddress: string;
   isVerified: boolean;
   credits: number;
   projectId: number;
   isListed: boolean;
   pricePerCredit: number;
   createdAt: string;
}
// TODO: fix typo of description in models.

export function ProjectCard({
    title,
    decscription,
    owner,
    ownerWalletAddress,
    isVerified,
    credits,
    projectId,
    isListed,
    pricePerCredit,
    createdAt,
}: ProjectCardProps) {
    return (
        <div>
            <h1>{title}</h1>
            <p>{decscription}</p>
            <p>{owner}</p>
            <p>{ownerWalletAddress}</p>
            <p>{isVerified}</p>
            <p>{credits}</p>
            <p>{projectId}</p>
            <p>{isListed}</p>
            <p>{pricePerCredit}</p>
            <p>{createdAt}</p>
        </div>
    );
}