<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UpdateUserBalance extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:user-balance';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mise à jour mensuelle du solde des utilisateurs';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Mettez à jour le solde de chaque utilisateur en ajoutant 1.83
        User::query()->update(['solde' => DB::raw('solde + 1.83')]);

        $this->info('Solde des utilisateurs mis à jour avec succès.');
    }
}
