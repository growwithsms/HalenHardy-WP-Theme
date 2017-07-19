<?php
/*
 * Template Name: Home Page
 * Description: A Home Page Template with a HERO section.
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
Timber::render( array( 'template-home.twig' ), $context );