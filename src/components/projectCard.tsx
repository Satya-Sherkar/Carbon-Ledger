import { Leaf, User, CheckCircle, Calendar, DollarSign } from "lucide-react";
import { formatEther } from "viem";

interface ProjectCardProps {
   title: string;
   description: string;
   owner: string;
   ownerWalletAddress: string;
   isVerified: boolean;
   credits: number;
   projectId: number;
   isListed: boolean;
   pricePerCredit: bigint;
   createdAt: string;
}

export function ProjectCard({
   title,
   description,
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
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
         {/* Header Section */}
         <div className="relative bg-emerald-900/40 p-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-emerald-300" />
                  <span className="text-white font-bold text-lg">
                     Project #{projectId}
                  </span>
               </div>
               <div className="flex items-center gap-2">
                  {isVerified && (
                     <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                     </span>
                  )}
                  <span
                     className={`px-3 py-1 rounded-full text-xs font-semibold ${isListed
                           ? "bg-blue-500/20 text-blue-300"
                           : "bg-gray-500/20 text-gray-300"
                        }`}
                  >
                     {isListed ? "Listed" : "Not Listed"}
                  </span>
               </div>
            </div>
         </div>

         {/* Card Content */}
         <div className="p-6 space-y-4">
            {/* Project Title & Description */}
            <div>
               <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
               <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
            </div>

            {/* Credits Information */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-sm text-gray-300 font-medium">
                        Carbon Credits
                     </p>
                     <p className="text-3xl font-bold text-white mt-1">
                        {credits.toLocaleString()}
                     </p>
                     <p className="text-xs text-gray-400 mt-1">tCO₂e</p>
                  </div>
                  <div className="bg-emerald-800/20 p-3 rounded-lg">
                     <Leaf className="w-8 h-8 text-emerald-300" />
                  </div>
               </div>
            </div>

            {/* Price Information */}
            {isListed && (
               <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                     <DollarSign className="w-4 h-4 text-gray-300" />
                     <p className="text-sm text-gray-300 font-medium">
                        Price per Credit
                     </p>
                  </div>
                  <p className="text-2xl font-bold text-emerald-300">
                     {formatEther(pricePerCredit)} ETH
                  </p>
               </div>
            )}

            {/* Owner Information */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
               <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-300" />
                  <p className="text-sm text-gray-300 font-medium">Owner ID</p>
               </div>
               <p className="text-sm text-white font-medium mb-1">{owner}</p>
               <p className="text-xs font-mono text-gray-400 break-all">
                  {ownerWalletAddress.slice(0, 6)}...{ownerWalletAddress.slice(-4)}
               </p>
            </div>

            {/* Created Date */}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
               <Calendar className="w-4 h-4" />
               <span>Created: {new Date(createdAt).toLocaleDateString()}</span>
            </div>
         </div>
      </div>
   );
}