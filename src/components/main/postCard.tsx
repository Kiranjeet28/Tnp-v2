import { Post } from '@prisma/client';
import { Star, Building2, GraduationCap, Clock, Calendar, ChevronRight, Bookmark, ExternalLink } from 'lucide-react';
import Link from 'next/link';

import React, { useState } from 'react';

export const PostCard = ({ post }: { post: Post }) => {
    const [showMoreTags, setShowMoreTags] = useState<boolean>(false);

    const isPostNotDue = (post: Post) => {
        if (!post.LastSubmittedAt) return false;
        return new Date(post.LastSubmittedAt) > new Date();
    };

    const formatDate = (date: string | Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    };

    const getDaysRemaining = (deadline: string | Date) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const stillOpen = isPostNotDue(post);
    const daysRemaining = post.LastSubmittedAt ? getDaysRemaining(post.LastSubmittedAt) : null;
    const isExpired = post.LastSubmittedAt;

    return (
        <Link href={`/post/${post.id}`} passHref>
            <div className={`group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-3 ${!isExpired
                ? 'border border-red-400 hover:border-red-500'
                : stillOpen
                    ? 'border-2 border-emerald-200 hover:border-emerald-300 bg-gradient-to-br from-emerald-50/30 via-white to-blue-50/30'
                    : 'border-2 border-slate-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50/30 hover:to-white'
                }`}>

                {/* Header Section */}
                <div className="relative p-8 pb-6">
                    {/* Status Badge */}
                    {stillOpen && (
                        <div className="absolute top-6 right-6">
                            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center shadow-lg">
                                <Star className="w-3 h-3 mr-2 fill-white" />
                                {daysRemaining && daysRemaining > 0 ? `${daysRemaining} days left` : 'Still Open'}
                            </div>
                        </div>
                    )}

                    {/* Expired Badge */}
                    {!isExpired && (
                        <div className="absolute top-6 right-6">
                            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center shadow-lg">
                                <Clock className="w-3 h-3 mr-2" />
                                Expired
                            </div>
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-blue-700 transition-colors duration-300 pr-20">
                        {post.title}
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p
                            className="text-slate-600 text-base leading-relaxed mb-6 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: post.excerpt }}
                        />
                    )}
                    <div className="flex flex-wrap gap-2">
                        {post.tags?.slice(0, 3).map((tag: string) => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all duration-200 cursor-default"
                            >
                                {tag}
                            </span>
                        ))}
                        {post.tags && post.tags.length > 3 && (
                            <span
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all duration-200 cursor-pointer relative"
                                onClick={e => {
                                    e.stopPropagation();
                                    setShowMoreTags((prev: boolean) => !prev);
                                }}
                            >
                                +{post.tags.length - 3} more
                                {showMoreTags && (
                                    <div className="absolute left-0 top-full mt-2 z-10 bg-white border rounded-xl shadow-lg p-3 flex flex-wrap gap-2 min-w-[120px]">
                                        {post.tags.slice(3).map(tag => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </span>
                        )}
                    </div>
                </div>


                {/* Content Section */}
                <div className="px-8 pb-6">
                    <p
                        className="text-slate-700 text-sm leading-relaxed line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>

                {/* Info Grid */}
                <div className="px-8 pb-6">
                    {/* Department */}
                    {post.department && (
                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex-shrink-0">
                                <Building2 className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-slate-500 font-medium">Department</p>
                                <p className="text-sm font-semibold text-slate-800 truncate">{post.department}</p>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">


                        {/* CGPA */}
                        {typeof post.CGPA === 'number' && (
                            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="flex-shrink-0">
                                    <GraduationCap className="w-5 h-5 text-purple-500" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-slate-500 font-medium">Min CGPA</p>
                                    <p className="text-sm font-semibold text-slate-800">{post.CGPA}</p>
                                </div>
                            </div>
                        )}

                        {/* Posted Date */}
                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex-shrink-0">
                                <Clock className="w-5 h-5 text-slate-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-slate-500 font-medium">Posted</p>
                                <p className="text-sm font-semibold text-slate-800">{formatDate(post.createdAt)}</p>
                            </div>
                        </div>

                        {/* Deadline */}
                        {post.LastSubmittedAt && (
                            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="flex-shrink-0">
                                    <Calendar className={`w-5 h-5 ${stillOpen ? 'text-emerald-500' : 'text-red-500'}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-slate-500 font-medium">Deadline</p>
                                    <p className={`text-sm font-semibold ${stillOpen ? 'text-emerald-700' : 'text-red-700'}`}>
                                        {formatDate(post.LastSubmittedAt)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>



                {/* Hover Overlay Effect */}
                <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none ${!isExpired
                    ? 'bg-red-500/10 opacity-0 group-hover:opacity-100'
                    : 'bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100'
                    }`} />
            </div>
        </Link>
    );
};