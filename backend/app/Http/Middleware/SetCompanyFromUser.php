<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetCompanyFromUser
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($user = $request->user()) {
            if ($companyId = $request->header('X-Company-Id')) {
                $user->current_company_id = $companyId;
            }
        }

        return $next($request);
    }
}
